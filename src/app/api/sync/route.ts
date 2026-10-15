import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteGoogleTokens, getSessionUser, loadGoogleTokens } from "@/lib/db";
import { syncGoogleIntoState } from "@/lib/google";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!loadGoogleTokens(user.id)) {
    return NextResponse.json({ connected: false, mails: [], events: [] });
  }

  try {
    const outcome = await syncGoogleIntoState(user.id);
    if (!outcome.connected) {
      return NextResponse.json({ connected: false, mails: [], events: [] });
    }
    if (outcome.updated.length === 0) {
      return NextResponse.json(
        { connected: true, error: "Sync failed. Try again shortly." },
        { status: 502 },
      );
    }
    const payload: Record<string, unknown> = { connected: true, updated: outcome.updated };
    if (outcome.updated.includes("mails")) payload.mails = outcome.state.mails;
    if (outcome.updated.includes("events")) payload.events = outcome.state.events;
    if (outcome.updated.includes("tasks")) payload.tasks = outcome.state.tasks;
    if (outcome.updated.includes("files")) payload.files = outcome.state.files;
    return NextResponse.json(payload);
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
