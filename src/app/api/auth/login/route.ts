import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCredentials, createSession } from "@/lib/db";
import { clearFailures, clientIp, isBlocked, registerFailure } from "@/lib/rateLimit";

const FAIL_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const ip = clientIp(request);
  const emailKey = `login:email:${email.toLowerCase()}`;
  const ipKey = `login:ip:${ip}`;

  const emailBlock = isBlocked(emailKey, 5);
  const ipBlock = isBlocked(ipKey, 20);
  const block = emailBlock.blocked ? emailBlock : ipBlock;
  if (block.blocked) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.max(1, Math.ceil(block.retryAfterSec / 60))} minute(s).`,
      },
      { status: 429, headers: { "Retry-After": String(block.retryAfterSec) } },
    );
  }

  const result = verifyCredentials(email, password);
  if (!result.ok) {
    registerFailure(emailKey, FAIL_WINDOW_MS);
    registerFailure(ipKey, FAIL_WINDOW_MS);
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  clearFailures(emailKey);

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
