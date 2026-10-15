import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteGoogleTokens, getSessionUser } from "@/lib/db";

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  deleteGoogleTokens(user.id);
  return NextResponse.json({ connected: false });
}
