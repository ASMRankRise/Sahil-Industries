import { NextRequest, NextResponse } from "next/server";
import {
  bcrypt,
  getAdminDb,
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  tokenHash,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== "string" || typeof password !== "string")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    const user = await getAdminDb()
      .prepare(
        "SELECT id, email, name, password_hash, role FROM admin_users WHERE lower(email) = lower(?)",
      )
      .bind(email.trim())
      .first<{
        id: string;
        email: string;
        name: string;
        password_hash: string;
        role: string;
      }>();
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    const token = crypto.randomUUID() + crypto.randomUUID();
    const expires = new Date(
      Date.now() + SESSION_TTL_SECONDS * 1000,
    ).toISOString();
    await getAdminDb()
      .prepare(
        "INSERT INTO admin_sessions (id, admin_user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
      )
      .bind(crypto.randomUUID(), user.id, await tokenHash(token), expires)
      .run();
    const response = NextResponse.json({
      user: { name: user.name, email: user.email, role: user.role },
    });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
