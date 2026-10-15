"use client";

import { useState } from "react";
import { FileText, FolderSimple } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { ChiefChat } from "@/components/ChiefChat";
import { Panel, PanelHeader, cn } from "@/components/ui";
import type { BrainFile } from "@/lib/types";

const KIND_ICON: Record<BrainFile["kind"], string> = {
  pdf: "PDF",
  doc: "DOC",
  sheet: "XLS",
  image: "IMG",
  notes: "MD",
  design: "DES",
};

export default function BrainPage() {
  const { files, googleConnected } = useStore();
  const [folder, setFolder] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const folders = ["All", ...Array.from(new Set(files.map((f) => f.folder))).sort()];
  const visible = folder === "All" ? files : files.filter((f) => f.folder === folder);
  const selected = files.find((f) => f.id === selectedId) ?? visible[0] ?? null;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Second brain</h2>
          <p className="mt-1 max-w-[60ch] text-[13px] text-ink-dim">
            Your Google Drive, indexed by type. Ask what&apos;s inside — answers cite
            the file.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr_400px]">
        <Panel className="h-fit">
          <PanelHeader title="Folders" />
          <nav className="p-2">
            {folders.map((f) => {
              const count =
                f === "All" ? files.length : files.filter((x) => x.folder === f).length;
              const active = folder === f;
              return (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={cn(
                    "mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors",
                    active ? "bg-indigo-tint text-ink" : "text-ink-dim hover:text-ink",
                  )}
                >
                  <FolderSimple
                    size={14}
                    weight={active ? "fill" : "regular"}
                    className="text-ink-faint"
                  />
                  <span className="flex-1 text-left">{f}</span>
                  <span className="font-mono text-[10px] text-ink-dim">{count}</span>
                </button>
              );
            })}
          </nav>
        </Panel>

        <Panel className="min-w-0">
          <PanelHeader title={folder === "All" ? "All files" : folder} meta={`${visible.length} items`} />
          <ul className="divide-y divide-line-soft">
            {visible.length === 0 ? (
              <li className="px-4 py-6 text-[12.5px] text-ink-faint">
                {googleConnected
                  ? "No files indexed yet."
                  : "Connect Google to index your Drive files."}
              </li>
            ) : (
              visible.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setSelectedId(f.id)}
                    className={cn(
                      "block w-full px-4 py-3 text-left transition-colors",
                      selected?.id === f.id ? "bg-indigo-tint" : "hover:bg-panel-2/60",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded border border-line bg-bg px-2 py-1 font-mono text-[9px] tracking-wider text-ink-dim">
                        {KIND_ICON[f.kind]}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink">
                        {f.name}
                      </span>
                      <span className="font-mono text-[10px] text-ink-dim">{f.size}</span>
                      <span className="font-mono text-[10px] text-ink-dim">{f.folder}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 pl-[38px] text-[12px] leading-relaxed text-ink-dim">
                      {f.summary}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel>
            <PanelHeader
              title="Preview"
              meta={selected ? selected.name : undefined}
              action={
                selected ? (
                  <span className="font-mono text-[10px] text-ink-faint">{selected.size}</span>
                ) : null
              }
            />
            {selected ? (
              <div className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo" />
                  <span className="font-mono text-[11px] text-ink-dim">{selected.folder}</span>
                  <div className="ml-auto flex gap-1">
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-line bg-bg px-2 py-1 font-mono text-[9px] text-ink-faint"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">
                  {selected.summary}
                </p>
                {selected.excerpt ? (
                  <div className="mt-3 rounded-lg border border-line bg-bg px-3 py-3">
                    <div className="mb-1 font-mono text-[9px] tracking-wider text-ink-faint uppercase">
                      Excerpt
                    </div>
                    <p className="font-mono text-[11.5px] leading-relaxed text-ink-dim">
                      {selected.excerpt}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="px-4 py-6 text-[13px] text-ink-faint">Select a file.</p>
            )}
          </Panel>

          <Panel className="flex min-h-[420px] flex-col">
            <PanelHeader title="Ask about your files" meta="cites sources" />
            <div className="min-h-0 flex-1">
              <ChiefChat compact />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
