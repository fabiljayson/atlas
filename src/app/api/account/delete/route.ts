import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deleteUserAccount,
  getSessionUser,
  verifyCredentials,
} from "@/lib/db";
import { clientIp, isBlocked, registerFailure } from "@/lib/rateLimit";

const FAIL_WINDOW_MS = 15 * 60 * 1000;

/**
 * POST /api/account/delete — permanent account deletion.
 *
 * Requires a valid session AND the current password (reauthentication), so a
 * hijacked tab cannot erase the account. All records are removed in a single
 * transaction and every session is revoked by removing its rows.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  // Reauthentication is a credential check: rate limit it like login.
  // Keys are namespaced so this cannot lock the login bucket (or vice versa).
  const emailKey = `delete:email:${user.email.toLowerCase()}`;
  const ipKey = `delete:ip:${clientIp(request)}`;
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

  const check = verifyCredentials(user.email, password);
  if (!check.ok) {
    registerFailure(emailKey, FAIL_WINDOW_MS);
    registerFailure(ipKey, FAIL_WINDOW_MS);
    return NextResponse.json({ error: "Password is incorrect." }, { status: 401 });
  }

  // Re-resolve the session user from the credential check: same account.
  // (The authed session could belong to the same id only, so this is safe.)
  const deleted = deleteUserAccount(check.user.id);
  if (!deleted) {
    // Session outlived the account by a race; treat as already deleted.
    // No personal data is left behind either way — the user row is the key.
    cookieStore.delete("atlas_session");
    return NextResponse.json({ ok: true });
  }

  cookieStore.delete("atlas_session");
  return NextResponse.json({ ok: true });
}
