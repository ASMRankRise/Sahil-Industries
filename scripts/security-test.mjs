/* Phase 11 security smoke tests.
 * Usage: BASE_URL=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/security-test.mjs
 * The gallery deletion test always uses a random id and must not delete real data.
 */
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const results = [];
let adminCookie = '';
const run = async (name, fn) => {
  try { await fn(); results.push(`PASS  ${name}`); }
  catch (error) { results.push(`FAIL  ${name}: ${error.message}`); }
};
const response = (path, init = {}) => fetch(`${base}${path}`, { redirect: 'manual', ...init });
const json = (body) => ({ headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const contactBody = (extra = {}) => ({ name: 'Security Test', email: `security-${Date.now()}@example.com`, subject: 'Security test', message: 'A sufficiently long security test message.', captcha: '5', captchaQuestion: '2 + 3', ...extra });

const adminApiRoot = join(process.cwd(), 'src', 'app', 'api', 'admin');
const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name === 'route.ts' || entry.name === 'route.tsx') files.push(path);
  }
  return files;
};

await run('Every non-auth admin API route enforces requireAdmin', async () => {
  const authRoutes = new Set(['login', 'logout', 'session']);
  const routes = await walk(adminApiRoot);
  for (const route of routes) {
    const relative = route.slice(adminApiRoot.length + 1).replace(/\\/g, '/');
    if (relative.startsWith('auth/') && authRoutes.has(relative.slice(5, -('/route.ts'.length)))) continue;
    const source = await readFile(route, 'utf8');
    assert.match(source, /requireAdmin\s*\(/, `${relative} must call requireAdmin`);
  }
});

await run('Unauthenticated /admin does not expose dashboard', async () => {
  const r = await response('/admin');
  assert.ok([200, 301, 302, 307, 308].includes(r.status));
  const text = await r.text();
  assert.doesNotMatch(text, /admin_session|admin dashboard|gallery management/i);
});

await run('Direct admin APIs reject missing cookies', async () => {
  const r = await response('/api/admin/gallery');
  assert.equal(r.status, 401);
});

await run('Unauthenticated gallery deletion is rejected', async () => {
  const r = await response(`/api/admin/gallery/${crypto.randomUUID()}`, { method: 'DELETE' });
  assert.equal(r.status, 401);
});

await run('Invalid password is rejected', async () => {
  const r = await response('/api/admin/auth/login', { method: 'POST', ...json({ email: process.env.ADMIN_EMAIL || 'admin@example.com', password: 'definitely-not-the-password' }) });
  assert.equal(r.status, 401);
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const valid = await response('/api/admin/auth/login', { method: 'POST', ...json({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }) });
    assert.equal(valid.status, 200, 'valid admin credentials are required for authenticated upload checks');
    adminCookie = valid.headers.get('set-cookie')?.split(';')[0] || '';
  }
});

await run('Expired/forged session is rejected', async () => {
  const r = await response('/api/admin/gallery', { headers: { cookie: 'admin_session=expired-or-forged-token' } });
  assert.equal(r.status, 401);
});

await run('Invalid captcha is rejected', async () => {
  const r = await response('/api/contact', { method: 'POST', ...json(contactBody({ captcha: '999' })) });
  assert.equal(r.status, 400);
});

await run('SQL injection payload is treated as data', async () => {
  const r = await response('/api/contact', { method: 'POST', ...json(contactBody({ name: "' OR 1=1 --", message: 'This is a harmless SQL injection test.' })) });
  assert.equal(r.status, 400);
});

await run('XSS in name is rejected', async () => {
  const r = await response('/api/contact', { method: 'POST', ...json(contactBody({ name: '<script>alert(1)</script>' })) });
  assert.equal(r.status, 400);
});

await run('XSS in message is escaped or rejected', async () => {
  const r = await response('/api/contact', { method: 'POST', ...json(contactBody({ message: '<img src=x onerror=alert(1)> long message' })) });
  assert.ok([200, 400].includes(r.status));
  if (r.status === 200) assert.doesNotMatch(await r.text(), /onerror=alert/i);
});

await run('Invalid upload is rejected before storage', async () => {
  const form = new FormData();
  form.append('file', new File(['not an image'], 'payload.php', { type: 'application/x-php' }));
  const r = await response('/api/admin/gallery/upload', { method: 'POST', ...(adminCookie ? { headers: { cookie: adminCookie } } : {}), body: form });
  assert.equal(r.status, adminCookie ? 400 : 401); // auth is checked before file validation
});

await run('Oversized upload is rejected without authentication bypass', async () => {
  const form = new FormData();
  form.append('file', new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' }));
  const r = await response('/api/admin/gallery/upload', { method: 'POST', ...(adminCookie ? { headers: { cookie: adminCookie } } : {}), body: form });
  assert.equal(r.status, adminCookie ? 400 : 401);
});

await run('Rate limit returns 429 after repeated submissions', async () => {
  let saw429 = false;
  for (let i = 0; i < 7; i++) {
    const r = await response('/api/contact', { method: 'POST', ...json(contactBody({ captcha: '5' })) });
    if (r.status === 429) { saw429 = true; break; }
  }
  assert.equal(saw429, true);
});

console.log(results.join('\n'));
const failures = results.filter((line) => line.startsWith('FAIL'));
console.log(`\n${results.length - failures.length}/${results.length} security checks passed`);
if (failures.length) process.exitCode = 1;
