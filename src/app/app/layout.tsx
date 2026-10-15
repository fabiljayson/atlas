import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, getOrCreateUserState } from "@/lib/db";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Atlas",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-deep text-[16px] font-semibold text-white">
            A
          </span>
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

  return (
    <StoreProvider initialState={state}>
      <Shell user={user}>{children}</Shell>
    </StoreProvider>
  );
}
