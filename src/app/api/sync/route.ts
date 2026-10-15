import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteGoogleTokens, getSessionUser, loadGoogleTokens, saveGoogleTokens } from "@/lib/db";
import { ensureFreshTokens, fetchCalendarToday, fetchGmailInbox } from "@/lib/google";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let tokens = loadGoogleTokens(user.id);
  if (!tokens) return NextResponse.json({ connected: false, mails: [], events: [] });

  try {
    tokens = await ensureFreshTokens(user.id, tokens, saveGoogleTokens);
    const [mails, events] = await Promise.all([
      fetchGmailInbox(tokens),
      fetchCalendarToday(tokens),
    ]);
    return NextResponse.json({ connected: true, mails, events });
  } catch (error) {
    // A 401 means the grant was revoked: drop tokens and report disconnected.
    if (error instanceof Error && /401/.test(error.message)) {
      deleteGoogleTokens(user.id);
      return NextResponse.json({ connected: false, mails: [], events: [] });
    }
    return NextResponse.json(
      { connected: true, error: "Sync failed. Try again shortly." },
      { status: 502 },
    );
  }
}
