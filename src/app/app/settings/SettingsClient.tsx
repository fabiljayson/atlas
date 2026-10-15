"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, inputClass, Modal, Panel, PanelHeader } from "@/components/ui";
import { cn } from "@/components/ui";

export function SettingsClient({
  name,
  email,
  googleConnected,
}: {
  name: string;
  email: string;
  googleConnected: boolean;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [google, setGoogle] = useState(googleConnected);
  const [googleBusy, setGoogleBusy] = useState(false);

  const disconnectGoogle = async () => {
    setGoogleBusy(true);
    try {
      await fetch("/api/google/disconnect", { method: "DELETE" });
      setGoogle(false);
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Panel>
        <PanelHeader title="Account" />
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 px-4 py-4 text-[13.5px]">
          <dt className="text-ink-dim">Name</dt>
          <dd className="text-ink">{name}</dd>
          <dt className="text-ink-dim">Email</dt>
          <dd className="text-ink">{email}</dd>
        </dl>
        <p className="border-t border-line-soft px-4 py-3 text-[12.5px] leading-relaxed text-ink-dim">
          Atlas is intended for people aged 16 and over. See the{" "}
          <Link href="/privacy" className="text-indigo hover:underline">
            privacy policy
          </Link>{" "}
          for what is stored and why, and{" "}
          <Link href="/terms" className="text-indigo hover:underline">
            terms of use
          </Link>
          .
        </p>
      </Panel>

      <Panel>
        <PanelHeader title="Google connection" meta={google ? "connected" : "not connected"} />
        <div className="px-4 py-4">
          {google ? (
            <div className="space-y-3">
              <p className="text-[13px] leading-relaxed text-ink-dim">
                Disconnecting removes the stored Google tokens from Atlas. Information already
                copied into your dashboard (mails, events, tasks, files) stays until account
                deletion. Disconnecting does not revoke access inside your Google account (manage
                that at myaccount.google.com/permissions).
              </p>
              <Button variant="outline" onClick={disconnectGoogle} disabled={googleBusy}>
                {googleBusy ? "Disconnecting…" : "Disconnect Google"}
              </Button>
            </div>
          ) : (
            <p className="text-[13px] text-ink-dim">
              No Google account is connected. Nothing in Atlas touches your Gmail, Calendar,
              Tasks or Drive right now.
            </p>
          )}
        </div>
      </Panel>

      <Panel className="border-critical/30">
        <PanelHeader title="Danger zone" meta="permanent" />
        <div className="px-4 py-4">
          <p className="max-w-[55ch] text-[13px] leading-relaxed text-ink-dim">
            Deleting your account removes your dashboard data (tasks, objectives, files,
            check-ins, chat, drafts), your synced Google tokens and your login. This is
            permanent and cannot be undone.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => setDeleteOpen(true)}>
            Delete my account...
          </Button>
        </div>
      </Panel>

      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} router={router} />
    </div>
  );
}

function DeleteDialog({
  open,
  onClose,
  router,
}: {
  open: boolean;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [password, setPassword] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (loading) return;
    setPassword("");
    setAcknowledged(false);
    setError(null);
    onClose();
  };

  const submit = async () => {
    if (loading || !password || !acknowledged) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Deletion failed. Try again.");
        setLoading(false);
        return;
      }
      // Cookie is cleared by the server; leave the app entirely.
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Nothing was deleted. Try again.");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Delete your account" width="max-w-xl">
      <p className="text-[13px] leading-relaxed text-ink-dim">
        This permanently removes:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-ink-dim">
        <li>Your name, email and password hash</li>
        <li>Dashboard data: tasks, objectives, files, check-ins, chat history, drafts</li>
        <li>Stored Google tokens and every active session (you are signed out everywhere)</li>
      </ul>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">
        This cannot be undone. Copies already sent to an AI provider by a chat message are not
        retrievable by Atlas after deletion; see the{" "}
        <Link href="/privacy" className="text-indigo hover:underline">
          privacy policy
        </Link>{" "}
        for the details and current limits.
      </p>
      <div className="mt-5 space-y-4">
        <Field label="Password">
          <input
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </Field>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-indigo)]"
          />
          <span className="text-[13px] text-ink-dim">
            I understand my account and data will be permanently deleted.
          </span>
        </label>
        {error ? (
          <p className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-[12.5px] text-critical-ink">
            {error}
          </p>
        ) : null}
        <div className={cn("flex justify-end gap-2 pt-1")}>
          <Button variant="ghost" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-critical hover:bg-critical-deep"
            onClick={submit}
            disabled={loading || !password || !acknowledged}
          >
            {loading ? "Deleting…" : "Delete permanently"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
