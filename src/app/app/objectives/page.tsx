"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Flag, Plus, Target } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { ChiefChat } from "@/components/ChiefChat";
import { Button, Field, Modal, Panel, PanelHeader, cn, inputClass } from "@/components/ui";

export default function ObjectivesPage() {
  return (
    <Suspense fallback={null}>
      <ObjectivesInner />
    </Suspense>
  );
}

function ObjectivesInner() {
  const { objectives, addObjective, toggleKeyResult, sendChat, chat } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const search = useSearchParams();
  const bootstrapped = useRef(false);

  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [deadline, setDeadline] = useState("");
  const [kr1, setKr1] = useState("");
  const [kr2, setKr2] = useState("");
  const [kr3, setKr3] = useState("");

  const query = search.get("q");

  useEffect(() => {
    if (!query || bootstrapped.current) return;
    bootstrapped.current = true;
    if (chat.length <= 1) void sendChat(query);
  }, [query, chat.length, sendChat]);

  const submit = () => {
    if (!title.trim()) return;
    const keyResults = [kr1, kr2, kr3].map((k) => k.trim()).filter(Boolean);
    addObjective({
      title: title.trim(),
      why: why.trim(),
      deadline: deadline.trim() || "No date",
      keyResults: keyResults.length ? keyResults : ["Define success"],
    });
    setTitle("");
    setWhy("");
    setDeadline("");
    setKr1("");
    setKr2("");
    setKr3("");
    setModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Objectives</h2>
          <p className="mt-1 max-w-[60ch] text-[13px] text-ink-dim">
            What you&apos;re steering toward. Your chief of staff reads these when you
            ask.
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={15} />
          New objective
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_440px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {objectives.length === 0 ? (
            <Panel className="px-4 py-8 sm:col-span-2">
              <p className="text-[13px] text-ink-dim">
                No objectives yet. Create your first one and your chief of staff will
                track it.
              </p>
            </Panel>
          ) : (
            objectives.map((o) => {
            const done = o.keyResults.filter((k) => k.done).length;
            const pct = o.keyResults.length
              ? Math.round((done / o.keyResults.length) * 100)
              : 0;
            return (
              <Panel key={o.id} className="flex flex-col">
                <PanelHeader
                  title={o.title.length > 30 ? `${o.title.slice(0, 30)}…` : o.title}
                  meta={o.deadline}
                  action={<Target size={14} className="text-indigo" />}
                />
                <div className="flex-1 px-4 py-4">
                  <p className="text-[12.5px] leading-relaxed text-ink-dim">{o.why}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                      <div
                        className="h-full rounded-full bg-indigo transition-all duration-slow"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-ink-dim">{pct}%</span>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {o.keyResults.map((k) => (
                      <li key={k.id}>
                        <label className="flex cursor-pointer items-start gap-2 text-[12.5px]">
                          <input
                            type="checkbox"
                            checked={k.done}
                            onChange={() => toggleKeyResult(o.id, k.id)}
                            className="mt-1 h-3.5 w-3.5 shrink-0 accent-indigo"
                          />
                          <span
                            className={cn(
                              k.done ? "text-ink-faint line-through" : "text-ink-dim",
                            )}
                          >
                            {k.label}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
              );
            })
          )}
        </div>

        <Panel className="flex min-h-[560px] flex-col xl:sticky xl:top-20 xl:h-[calc(100dvh-6.5rem)]">
          <PanelHeader
            title="Chief of staff"
            meta="search · write · read"
            action={<Flag size={14} className="text-indigo" />}
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <ChiefChat />
          </div>
        </Panel>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New objective">
        <div className="space-y-4">
          <Field label="Objective">
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ship the beta to 10 testers"
            />
          </Field>
          <Field label="Why it matters">
            <textarea
              className={cn(inputClass, "min-h-[64px] resize-y")}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Real usage beats speculation…"
            />
          </Field>
          <Field label="Deadline">
            <input
              className={inputClass}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Nov 15"
            />
          </Field>
          <Field label="Key results" hint="Up to three. Checkboxes update progress.">
            <div className="space-y-2">
              <input
                className={inputClass}
                value={kr1}
                onChange={(e) => setKr1(e.target.value)}
                placeholder="Onboarding flow complete"
              />
              <input
                className={inputClass}
                value={kr2}
                onChange={(e) => setKr2(e.target.value)}
                placeholder="10 testers onboarded"
              />
              <input
                className={inputClass}
                value={kr3}
                onChange={(e) => setKr3(e.target.value)}
                placeholder="Feedback doc with 20 insights"
              />
            </div>
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit} disabled={!title.trim()}>
              Create objective
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
