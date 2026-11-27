import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    const fullPath = resolve(process.cwd(), file);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!env[key]) env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
const apiToken = env.CLOUDFLARE_API_TOKEN;

async function executeD1Query(sql, params = []) {
  if (!accountId || !databaseId || !apiToken) {
    throw new Error("Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, or CLOUDFLARE_API_TOKEN in .env.local");
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.errors?.[0]?.message || "Cloudflare D1 query failed");
  }
  return json.result?.[0] || { results: [] };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n==================================================");
console.log("   Sahil Industries - Cloudflare D1 Admin Reset   ");
console.log("==================================================\n");

try {
  let existingAdmins = [];
  try {
    const queryRes = await executeD1Query("SELECT id, email, name, role FROM admin_users;");
    existingAdmins = queryRes.results || [];
  } catch (err) {
    console.warn("⚠️  Could not fetch existing admins automatically:", err.message);
  }

  if (existingAdmins.length > 0) {
    console.log("Found existing admin accounts in Cloudflare D1:");
    existingAdmins.forEach((u, i) => {
      console.log(`  [${i + 1}] Email: ${u.email} (Name: ${u.name || "N/A"})`);
    });
    console.log("");
  }

  const defaultEmail = existingAdmins[0]?.email || "";
  const emailPrompt = defaultEmail 
    ? `Target Admin Email [${defaultEmail}]: ` 
    : "Target Admin Email: ";
  
  let targetEmail = (await rl.question(emailPrompt)).trim().toLowerCase();
  if (!targetEmail && defaultEmail) {
    targetEmail = defaultEmail;
  }

  if (!targetEmail) {
    console.error("❌ Target email is required.");
    process.exit(1);
  }

  const newEmailInput = (await rl.question(`New Email for this admin (leave blank to keep '${targetEmail}'): `)).trim().toLowerCase();
  const finalEmail = newEmailInput || targetEmail;

  const newPassword = await rl.question("Enter New Password (min 12 chars): ", { echo: false });
  const confirmPassword = await rl.question("\nConfirm New Password: ", { echo: false });
  rl.close();
  console.log("\n");

  if (newPassword.length < 12) {
    console.error("❌ Error: Password must be at least 12 characters.");
    process.exit(1);
  }

  if (newPassword !== confirmPassword) {
    console.error("❌ Error: Passwords do not match.");
    process.exit(1);
  }

  console.log("⏳ Hashing password with bcrypt (factor 12)...");
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const escapedTarget = targetEmail.replaceAll("'", "''");
  const escapedFinal = finalEmail.replaceAll("'", "''");

  const updateSql = `UPDATE admin_users SET email = '${escapedFinal}', password_hash = '${passwordHash}', updated_at = datetime('now') WHERE lower(email) = lower('${escapedTarget}');`;
  const deleteSessionsSql = `DELETE FROM admin_sessions WHERE admin_user_id = (SELECT id FROM admin_users WHERE lower(email) = lower('${escapedFinal}'));`;

  console.log(`⏳ Updating Cloudflare D1 database for ${targetEmail}...`);

  try {
    const updateResult = await executeD1Query(updateSql);
    const rowsChanged = updateResult.meta?.changes ?? updateResult.meta?.rows_written ?? 0;

    if (rowsChanged === 0) {
      console.warn(`\n⚠️  Warning: No existing record found for '${targetEmail}'. Creating new admin user instead...`);
      const insertSql = `INSERT INTO admin_users (id, email, password_hash, name, role) VALUES ('${crypto.randomUUID()}', '${escapedFinal}', '${passwordHash}', 'Administrator', 'admin');`;
      await executeD1Query(insertSql);
      console.log(`✅ Created new admin account with email: ${finalEmail}`);
    } else {
      await executeD1Query(deleteSessionsSql);
      console.log(`✅ Success! Admin updated:`);
      console.log(`   - Previous Email: ${targetEmail}`);
      console.log(`   - Current Email:  ${finalEmail}`);
      console.log(`   - Password:       Updated successfully`);
      console.log(`   - Active sessions invalidated.`);
    }
  } catch (apiError) {
    console.error("\n❌ Direct Cloudflare API update failed:", apiError.message);
    console.log("\nYou can manually run this SQL in Cloudflare Dashboard (D1 > sahil-industries-gallery > Console):");
    console.log("--------------------------------------------------------------------------------");
    console.log(updateSql);
    console.log(deleteSessionsSql);
    console.log("--------------------------------------------------------------------------------\n");
    process.exit(1);
  }
} catch (e) {
  console.error("Unexpected error:", e);
  process.exit(1);
}
