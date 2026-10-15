"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 320px at 50% -10%, rgba(79,70,229,0.16), transparent 70%)",
        }}
      />
      <div className="anim-fade-up relative w-full max-w-[400px]">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2.5"
          aria-label="Atlas home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-deep text-[15px] font-semibold text-white">
            A
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">Atlas</span>
        </Link>

        <div className="rounded-2xl border border-line bg-panel p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <h1 className="text-lg font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1 text-[13px] text-ink-dim">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>

        <p className="mt-5 text-center text-[13px] text-ink-dim">{footer}</p>
      </div>
    </div>
  );
}

export function AuthError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="rounded-lg border border-[#3a2230] bg-[#1d1220] px-3 py-2 text-[12.5px] text-critical">
      {error}
    </p>
  );
}

export function useAuthSubmit(path: "/api/auth/login" | "/api/auth/signup") {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      router.push("/app");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
