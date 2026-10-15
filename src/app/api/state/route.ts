import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, getOrCreateUserState, saveUserState } from "@/lib/db";
import { PERSISTED_SLICES, type PersistedState } from "@/lib/types";

const MAX_BODY_BYTES = 2_000_000;

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return null;
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ state: getOrCreateUserState(user.id) });
}

export async function PUT(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "State too large" }, { status: 413 });
  }

  let body: { state?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const state = body.state;
  if (typeof state !== "object" || state === null || Array.isArray(state)) {
    return NextResponse.json({ error: "state must be an object" }, { status: 400 });
  }

  const incoming = state as Record<string, unknown>;
  for (const key of Object.keys(incoming)) {
    if (!(PERSISTED_SLICES as string[]).includes(key)) {
      return NextResponse.json({ error: `Unknown slice: ${key}` }, { status: 400 });
    }
    if (!Array.isArray(incoming[key])) {
      return NextResponse.json({ error: `Slice ${key} must be an array` }, { status: 400 });
    }
  }

  const merged: PersistedState = {
    ...getOrCreateUserState(user.id),
    ...(incoming as unknown as PersistedState),
  };
  saveUserState(user.id, merged);

  return NextResponse.json({ ok: true });
}
