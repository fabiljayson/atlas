"use client";

import { useState } from "react";
import { Copy, Plus, Sparkle } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { Button, Field, Panel, PanelHeader, cn, inputClass } from "@/components/ui";
import type { ContentDraft } from "@/lib/types";

const STYLES: { id: ContentDraft["style"]; label: string; hint: string }[] = [
  { id: "editorial", label: "Editorial", hint: "Big type, thin rules" },
  { id: "signal", label: "Signal", hint: "Solid indigo, one statement" },
  { id: "minimal", label: "Minimal", hint: "Quiet card, small mark" },
];

export default function StudioPage() {
  const { drafts, generateDraft, pushNotification } = useStore();
  const [kind, setKind] = useState<"post" | "newsletter">("post");
  const [style, setStyle] = useState<ContentDraft["style"]>("editorial");
  const [topic, setTopic] = useState("");
  const draft = drafts[0];

  const onCreate = () => {
    generateDraft({ kind, style, topic });
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Content studio</h2>
          <p className="mt-1 max-w-[60ch] text-[13px] text-ink-dim">
            Posts and newsletters in your voice, on your theme. Everything below already
            uses your brand system.
          </p>
        </div>
        <Button variant="primary" onClick={onCreate}>
          <Plus size={15} />
          Create content
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_340px_1fr]">
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader title="Brand" meta="locked to theme" />
            <div className="space-y-4 px-4 py-4">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 40 40" className="h-10 w-10" aria-label="Logo mark">
                  <rect width="40" height="40" rx="10" fill="#4F46E5" />
                  <path
                    d="M12 30 L20 10 L28 30 M15.2 23.5 H24.8"
                    stroke="white"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div>
                  <div className="text-[13px] font-medium text-ink">Atlas</div>
                  <div className="font-mono text-[10px] text-ink-faint">wordmark · v3</div>
                </div>
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                  Colors
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { hex: "#4F46E5", name: "Indigo" },
                    { hex: "#818CF8", name: "Soft" },
                    { hex: "#151B33", name: "Surface" },
                    { hex: "#0A0D17", name: "Ink bg" },
                  ].map((c) => (
                    <div key={c.hex} className="text-center">
                      <div
                        className="h-9 rounded-md border border-line"
                        style={{ background: c.hex }}
                      />
                      <div className="mt-1 font-mono text-[8.5px] text-ink-faint">
                        {c.hex}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                  Type
                </div>
                <div className="rounded-lg border border-line bg-bg px-3 py-2">
                  <div className="text-[15px] font-medium text-ink">Geist</div>
                  <div className="text-[11px] text-ink-faint">Headlines & UI</div>
                </div>
                <div className="mt-1.5 rounded-lg border border-line bg-bg px-3 py-2">
                  <div className="font-mono text-[14px] text-ink">JetBrains Mono</div>
                  <div className="text-[11px] text-ink-faint">Data & labels</div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
                  Voice
                </div>
                <p className="text-[12.5px] leading-relaxed text-ink-dim">
                  Calm, direct, professional. Short sentences. No hype, no emoji.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <Panel className="h-fit">
          <PanelHeader title="Compose" />
          <div className="space-y-4 px-4 py-4">
            <div className="flex gap-1 rounded-lg border border-line bg-bg p-1">
              {(["post", "newsletter"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-[12.5px] font-medium transition-colors",
                    kind === k ? "bg-panel-2 text-ink" : "text-ink-faint hover:text-ink-dim",
                  )}
                >
                  {k === "post" ? "Post" : "Newsletter"}
                </button>
              ))}
            </div>

            <div>
              <div className="mb-1.5 text-[12px] font-medium text-ink-dim">Card style</div>
              <div className="space-y-1.5">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                      style === s.id
                        ? "border-[#35407a] bg-panel-2"
                        : "border-line hover:border-[#2a3358]",
                    )}
                  >
                    <span className="text-[13px] text-ink">{s.label}</span>
                    <span className="font-mono text-[10px] text-ink-faint">{s.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <Field label="What's it about?" hint="Your chief of staff writes the copy.">
              <textarea
                className={cn(inputClass, "min-h-[80px] resize-y")}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Building an AI chief of staff…"
              />
            </Field>

            <Button variant="primary" className="w-full" onClick={onCreate}>
              <Sparkle size={15} />
              Create content
            </Button>
            <button
              onClick={() =>
                pushNotification({
                  kind: "content",
                  title: "Draft copied",
                  body: "Text copied to clipboard (demo).",
                })
              }
              className="flex w-full items-center justify-center gap-1.5 py-1 font-mono text-[10px] tracking-wider text-ink-faint uppercase transition-colors hover:text-ink-dim"
            >
              <Copy size={11} />
              Copy last draft
            </button>
          </div>
        </Panel>

        <Panel className="min-w-0">
          <PanelHeader
            title="Preview"
            meta={draft ? `${draft.style} · ${draft.kind}` : "no draft yet"}
          />
          <div className="px-4 py-5">
            {draft ? (
              <div className="space-y-4">
                <PreviewCard draft={draft} />
                {draft.kind === "newsletter" ? <NewsletterPreview draft={draft} /> : null}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 text-center">
                <svg viewBox="0 0 40 40" className="mb-3 h-9 w-9 opacity-60">
                  <rect width="40" height="40" rx="10" fill="#4F46E5" />
                  <path
                    d="M12 30 L20 10 L28 30 M15.2 23.5 H24.8"
                    stroke="white"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <p className="text-[13px] text-ink-dim">
                  Nothing generated yet. Pick a style and hit create content.
                </p>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function PreviewCard({ draft }: { draft: ContentDraft }) {
  if (draft.style === "signal") {
    return (
      <article className="anim-fade-up rounded-2xl bg-indigo-deep p-7 text-white">
        <div className="flex items-center justify-between">
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <rect width="40" height="40" rx="10" fill="white" fillOpacity="0.15" />
            <path
              d="M12 30 L20 10 L28 30 M15.2 23.5 H24.8"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-70">
            {draft.kicker}
          </span>
        </div>
        <h3 className="mt-8 text-[26px] leading-[1.15] font-semibold tracking-tight">
          {draft.headline}
        </h3>
        <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed opacity-85">
          {draft.body}
        </p>
        <div className="mt-6 border-t border-white/20 pt-3 font-mono text-[10px] tracking-wider uppercase opacity-70">
          Atlas · keep the calm
        </div>
      </article>
    );
  }

  if (draft.style === "minimal") {
    return (
      <article className="anim-fade-up rounded-2xl border border-line bg-bg p-6">
        <div className="flex items-center justify-between">
          <svg viewBox="0 0 40 40" className="h-5 w-5">
            <rect width="40" height="40" rx="10" fill="#4F46E5" />
            <path
              d="M12 30 L20 10 L28 30 M15.2 23.5 H24.8"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="font-mono text-[10px] text-ink-faint">{draft.kicker}</span>
        </div>
        <h3 className="mt-6 text-[17px] leading-snug font-medium text-ink">
          {draft.headline}
        </h3>
        <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-ink-dim">
          {draft.body}
        </p>
        <div className="mt-5 h-px bg-line" />
        <div className="mt-2 font-mono text-[10px] text-ink-faint">atlas.dashboard</div>
      </article>
    );
  }

  return (
    <article className="anim-fade-up overflow-hidden rounded-2xl border border-line bg-panel-2">
      <div className="border-b border-line px-7 pt-7 pb-4">
        <span className="font-mono text-[10px] tracking-[0.22em] text-indigo uppercase">
          {draft.kicker}
        </span>
        <h3 className="mt-3 text-[28px] leading-[1.1] font-semibold tracking-tight text-ink">
          {draft.headline}
        </h3>
      </div>
      <div className="px-7 py-5">
        <p className="max-w-[54ch] text-[14px] leading-relaxed text-ink-dim">{draft.body}</p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[12px] font-medium text-ink">Atlas</span>
          <span className="font-mono text-[10px] text-ink-faint">
            {new Date().toLocaleDateString([], { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </article>
  );
}

function NewsletterPreview({ draft }: { draft: ContentDraft }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] tracking-wider text-ink-faint uppercase">
        Email frame
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-bg">
        <div className="flex items-center gap-2 border-b border-line px-5 py-3">
          <svg viewBox="0 0 40 40" className="h-4 w-4">
            <rect width="40" height="40" rx="10" fill="#4F46E5" />
            <path
              d="M12 30 L20 10 L28 30 M15.2 23.5 H24.8"
              stroke="white"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-[12px] font-semibold text-ink">Atlas Weekly</span>
          <span className="ml-auto font-mono text-[10px] text-ink-faint">Issue 05</span>
        </div>
        <div className="px-5 py-6">
          <div className="h-0.5 w-10 bg-indigo-deep" />
          <h4 className="mt-4 text-[20px] leading-tight font-semibold text-ink">
            {draft.headline}
          </h4>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">{draft.body}</p>
          <button className="mt-5 rounded-lg bg-indigo-deep px-4 py-2 text-[12.5px] font-medium text-white">
            Read the full issue
          </button>
          <div className="mt-6 border-t border-line pt-3 text-[11px] text-ink-faint">
            You&apos;re getting this because you subscribed. Unsubscribe anytime.
          </div>
        </div>
      </div>
    </div>
  );
}
