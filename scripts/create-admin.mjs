import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { execFileSync } from "node:child_process";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const email = (await rl.question("Admin email: ")).trim().toLowerCase();
const name = (await rl.question("Admin name: ")).trim() || "Administrator";
const password = await rl.question("Admin password: ", { echo: false });
rl.close();
if (!email || password.length < 12)
  throw new Error(
    "Use a valid email and a password of at least 12 characters.",
  );
const sql = `INSERT INTO admin_users (id, email, password_hash, name) VALUES ('${crypto.randomUUID()}', '${email.replaceAll("'", "''")}', '${await bcrypt.hash(password, 12)}', '${name.replaceAll("'", "''")}');`;
const wrangler = process.platform === "win32" ? "npx.cmd" : "npx";
const remote = process.argv.includes("--remote");
try {
  execFileSync(wrangler, ["wrangler", "d1", "execute", "sahil-industries-db", remote ? "--remote" : "--local", "--command", sql], { stdio: "inherit" });
  console.log(`Admin account created in ${remote ? "remote" : "local"} D1.`);
} catch {
  console.error(`Could not write to ${remote ? "remote" : "local"} D1. Run this SQL manually:\n` + sql);
  process.exitCode = 1;
}
