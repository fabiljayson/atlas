import { Suspense } from "react";
import { cookies } from "next/headers";
import { getSessionUser, loadGoogleTokens } from "@/lib/db";
import { SettingsClient } from "./SettingsClient";

export const metadata = {
  title: "Atlas — account settings",
};

// cacheComponents is on: cookies/DB access must sit inside a Suspense boundary.
export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <SettingsData />
    </Suspense>
  );
}

async function SettingsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);
  if (!user) return null; // layout guard already redirects unauthenticated users
  const googleConnected = loadGoogleTokens(user.id) !== null;

  return <SettingsClient name={user.name} email={user.email} googleConnected={googleConnected} />;
}
