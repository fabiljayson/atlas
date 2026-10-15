import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/lib/db";


export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value;
  if (token) destroySession(token);
  cookieStore.delete("atlas_session");
  return NextResponse.json({ ok: true });
}
