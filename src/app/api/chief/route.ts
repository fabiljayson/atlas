import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/db";
import { respondToChief } from "@/lib/askChief";
import type { ChiefContext } from "@/lib/chief";

const MAX_MESSAGE = 2000;

function isTaskArray(value: unknown): boolean {
  return Array.isArray(value) && value.length <= 200;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    message?: string;
    ctx?: { tasks?: unknown; objectives?: unknown; files?: unknown; checkins?: unknown };
  } | null;

  const message = body?.message?.trim() ?? "";
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Message must be 1-${MAX_MESSAGE} characters.` },
      { status: 400 },
    );
  }

  const ctxIn = body?.ctx;
  const ctx: ChiefContext = {
    tasks: isTaskArray(ctxIn?.tasks) ? (ctxIn!.tasks as ChiefContext["tasks"]) : [],
    objectives: isTaskArray(ctxIn?.objectives)
      ? (ctxIn!.objectives as ChiefContext["objectives"])
      : [],
    files: isTaskArray(ctxIn?.files) ? (ctxIn!.files as ChiefContext["files"]) : [],
    checkins: isTaskArray(ctxIn?.checkins) ? (ctxIn!.checkins as ChiefContext["checkins"]) : [],
  };

  const reply = await respondToChief(message, ctx);
  return NextResponse.json(reply);
}
