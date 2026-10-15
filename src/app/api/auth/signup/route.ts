import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createUser, createSession } from "@/lib/db";
import { clientIp, isBlocked, registerFailure } from "@/lib/rateLimit";

const SIGNUP_WINDOW_MS = 60 * 60 * 1000;
const MAX_SIGNUPS_PER_IP = 10;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  const ipKey = `signup:ip:${clientIp(request)}`;
  const limit = isBlocked(ipKey, MAX_SIGNUPS_PER_IP);
  if (limit.blocked) {
    return NextResponse.json(
      { error: "Too many signups from this network. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }
  registerFailure(ipKey, SIGNUP_WINDOW_MS);

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const result = createUser(name, email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  const token = createSession(result.user.id);
  const cookieStore = await cookies();
  cookieStore.set("atlas_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return NextResponse.json({ user: result.user });
}
