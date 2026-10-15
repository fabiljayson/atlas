import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { getSessionUser } from "@/lib/db";
import { buildAuthUrl, googleConfigured } from "@/lib/google";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL("/app?google=not-configured", request.url),
      307,
    );
  }

  const state = randomBytes(16).toString("hex");
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.redirect(buildAuthUrl(state), 302);
}
