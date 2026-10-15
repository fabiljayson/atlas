import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, getOrCreateUserState, loadGoogleTokens } from "@/lib/db";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Atlas",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <LogoMark size={36} className="h-9 w-9" />
        </div>
      }
    >
      <AuthedShell>{children}</AuthedShell>
    </Suspense>
  );
}

async function AuthedShell({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("atlas_session")?.value ?? "";
  const user = getSessionUser(token);

  if (!user) redirect("/login");

  const state = getOrCreateUserState(user.id);
  const googleConnected = loadGoogleTokens(user.id) !== null;

  return (
    <StoreProvider initialState={state} googleConnected={googleConnected}>
      <Shell user={user}>{children}</Shell>
    </StoreProvider>
  );
}
