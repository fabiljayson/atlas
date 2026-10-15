"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { cn } from "./ui";

const QUICK = [
  "What's urgent today?",
  "Summarize q4-report-draft",
  "Plan my tomorrow",
];

export function ChiefChat({ compact = false }: { compact?: boolean }) {
  const { chat, chatThinking, sendChat } = useStore();
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat, chatThinking]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatThinking) return;
    setValue("");
    void sendChat(trimmed);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={cn("flex-1 space-y-3 overflow-y-auto px-4 py-4", compact && "max-h-[360px]")}>
        {chat.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-indigo-deep text-white"
                  : "border border-line bg-panel-2 text-ink-dim",
              )}
            >
              {m.role === "chief" ? (
                <div className="mb-1.5 font-mono text-[10px] tracking-wider text-indigo uppercase">
                  Chief of staff
                </div>
              ) : null}
              {m.text}
              {m.sources?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.sources.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-ink-faint"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {chatThinking ? (
          <div className="flex items-center gap-1.5 px-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-indigo anim-pulse-dot"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
            <span className="ml-1 font-mono text-[10px] text-ink-faint">reading your world…</span>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line-soft px-4 pt-3 pb-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => submit(q)}
              className="rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-[10px] text-ink-dim transition-colors hover:border-[#2a3358] hover:text-ink"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          className="flex gap-2"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask your chief of staff…"
            aria-label="Message the chief of staff"
            className="h-10 flex-1 rounded-lg border border-line bg-bg px-3 text-sm text-ink placeholder:text-ink-faint focus:border-[#35407a] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!value.trim() || chatThinking}
            aria-label="Send"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-deep text-white transition-all active:translate-y-px disabled:opacity-40"
          >
            <PaperPlaneTilt size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
