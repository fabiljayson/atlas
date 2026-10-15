import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { getSessionUser, saveGoogleTokens } from "@/lib/db";
import { exchangeCode, syncGoogleIntoState } from "@/lib/google";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(sessionToken);
  if (!user) return NextResponse.redirect(new URL("/login", request.url), 307);

  const expectedState = cookieStore.get("google_oauth_state")?.value ?? "";
  cookieStore.delete("google_oauth_state");

  if (error || !code || !state || !expectedState || !safeEqual(state, expectedState)) {
    return NextResponse.redirect(new URL("/app?google=failed", request.url), 307);
  }

  try {
    const tokens = await exchangeCode(code);
    saveGoogleTokens(user.id, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scope: tokens.scope,
    });
    try {
      await syncGoogleIntoState(user.id);
    } catch {
      // First sync is best-effort; the Sync button retries.
    }
    return NextResponse.redirect(new URL("/app?google=connected", request.url), 307);
  } catch {
    return NextResponse.redirect(new URL("/app?google=failed", request.url), 307);
  }
}
