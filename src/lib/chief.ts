import { CHECKINS } from "./data";
import type { BrainFile, ChatMessage, Objective, Task } from "./types";

export interface ChiefContext {
  tasks: Task[];
  objectives: Objective[];
  files: BrainFile[];
}

function progressOf(o: Objective) {
  if (o.keyResults.length === 0) return 0;
  const done = o.keyResults.filter((k) => k.done).length;
  return Math.round((done / o.keyResults.length) * 100);
}

export function getChiefReply(
  query: string,
  ctx: ChiefContext,
): { text: string; sources: string[] } {
  const q = query.toLowerCase();

  const fileHit = ctx.files.find((f) =>
    f.name
      .toLowerCase()
      .split(/[-_.]/)
      .some((part) => part.length > 3 && q.includes(part)),
  );

  if (fileHit) {
    return {
      text: `I read "${fileHit.name}". ${fileHit.summary}\n\nKey excerpt: "${fileHit.excerpt}"\n\nWant me to turn this into a task or a draft?`,
      sources: [fileHit.name],
    };
  }

  if (/(urgent|priority|today|first|now|what should i)/.test(q)) {
    const critical = ctx.tasks.filter((t) => t.urgency === "critical" && !t.done);
    const high = ctx.tasks.filter((t) => t.urgency === "high" && !t.done);
    const lines = [...critical, ...high]
      .slice(0, 4)
      .map((t, i) => `${i + 1}. ${t.title} — ${t.due}`);
    return {
      text: `Here's the order of operations:\n\n${lines.join("\n")}\n\nCritical mail from Mira and Bright Labs Legal sits underneath tasks 1 and 2 — answer the clause question and the countersignature follows.`,
      sources: ["Today · tasks", "Mail"],
    };
  }

  if (/(objective|goal|progress|status|on track)/.test(q)) {
    const lines = ctx.objectives.map(
      (o) => `• ${o.title} — ${progressOf(o)}% · due ${o.deadline}`,
    );
    return {
      text: `Current objectives:\n\n${lines.join("\n")}\n\nWeakest link: ${ctx.objectives[0].title}. Its first key result is done; the tester onboarding is where I'd push today.`,
      sources: ["Objectives"],
    };
  }

  if (/(tomorrow|plan|schedule|check-?in|yesterday)/.test(q)) {
    const last = CHECKINS[CHECKINS.length - 1];
    return {
      text: `From your last check-in:\n\nWorked: ${last.worked}\nStuck: ${last.stuck}\nTomorrow: ${last.tomorrow}\n\nI'd keep tomorrow to two things: the Q4 draft and clause 7.2. Everything else is scheduling, not urgency.`,
      sources: ["Evening check-in"],
    };
  }

  if (/(write|draft|post|newsletter|content)/.test(q)) {
    return {
      text: "Draft ready in Content Studio — I kept the voice rules from tone-of-voice.md: calm, direct, no hype.\n\nHeadline: \"A dashboard that reads my files and runs my evening.\"\n\nOpen the Studio to style it as a card or send it as the newsletter.",
      sources: ["tone-of-voice.md", "Content Studio"],
    };
  }

  if (/(search|find|where|which file|look)/.test(q)) {
    const hits = ctx.files.filter(
      (f) =>
        f.name.toLowerCase().includes(q.replace(/^(search|find|where|which file|look for|for)\s*/g, "")) ||
        f.tags.some((t) => q.includes(t)),
    );
    const list = (hits.length ? hits : ctx.files.slice(0, 3))
      .map((f) => `• ${f.name} (${f.folder})`)
      .join("\n");
    return {
      text: `Matches in your second brain:\n\n${list}\n\nAsk me to summarize any of them.`,
      sources: ["Second brain"],
    };
  }

  const openTasks = ctx.tasks.filter((t) => !t.done).length;
  return {
    text: `I checked your world: ${openTasks} open tasks, ${ctx.files.filter((f) => f.folder === "Inbox").length} files still unsorted, ${ctx.objectives.length} objectives in flight.\n\nAsk me to search your files, draft content, summarize an objective, or plan tomorrow.`,
    sources: ["Dashboard"],
  };
}

export function makeMessage(
  role: ChatMessage["role"],
  text: string,
  sources?: string[],
): ChatMessage {
  return { id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, text, sources };
}
