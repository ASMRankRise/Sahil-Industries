type D1Row = Record<string, unknown>;

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

async function request(path: string, body: unknown) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${required('CLOUDFLARE_ACCOUNT_ID')}/d1/database/${required('CLOUDFLARE_D1_DATABASE_ID')}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${required('CLOUDFLARE_API_TOKEN')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const json = await response.json() as { success?: boolean; errors?: { message?: string }[]; result?: { results?: D1Row[]; meta?: Record<string, unknown> }[] };
  if (!response.ok || !json.success) throw new Error(json.errors?.[0]?.message || 'D1 request failed');
  return json.result?.[0] || { results: [] };
}

export type D1Statement = { bind: (...values: unknown[]) => D1Statement; first<T>(): Promise<T | null>; all<T>(): Promise<{ results: T[] }>; run(): Promise<unknown> };
export function getD1Client() {
  const statement = (sql: string, values: unknown[] = []): D1Statement => ({
    bind: (...next) => statement(sql, next),
    first: async <T>() => (await request('query', { sql, params: values })).results?.[0] as T || null,
    all: async <T>() => ({ results: ((await request('query', { sql, params: values })).results || []) as T[] }),
    run: async () => request('query', { sql, params: values }),
  });
  return { prepare: (sql: string) => statement(sql) };
}
