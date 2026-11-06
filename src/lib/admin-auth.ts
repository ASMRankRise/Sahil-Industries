import { getCloudflareContext } from "@opennextjs/cloudflare";
import bcrypt from "bcryptjs";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

type DB = {
  prepare: (sql: string) => {
    bind: (...values: string[]) => {
      first: <T>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};
export function getAdminDb(): DB {
  const { env } = getCloudflareContext();
  return (env as unknown as { GALLERY_DB: DB }).GALLERY_DB;
}

async function tokenHash(token: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminSession(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  if (!token) return null;
  const row = await getAdminDb()
    .prepare(
      `SELECT u.id, u.email, u.name, u.role FROM admin_sessions s JOIN admin_users u ON u.id = s.admin_user_id WHERE s.token_hash = ? AND s.expires_at > datetime('now')`,
    )
    .bind(await tokenHash(token))
    .first<{ id: string; email: string; name: string; role: string }>();
  return row;
}

/** Call this at the start of every admin API handler; never trust client state. */
export async function requireAdmin(request: Request) {
  const user = await verifyAdminSession(request);
  if (!user) throw new Error("ADMIN_UNAUTHORIZED");
  return user;
}

export { bcrypt, tokenHash };
