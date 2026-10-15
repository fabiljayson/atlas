import type { BrainFile, ChatMessage, CheckIn, Objective, Task } from "./types";

export interface ChiefContext {
  tasks: Task[];
  objectives: Objective[];
  files: BrainFile[];
  checkins: CheckIn[];
}

export const WELCOME_MESSAGE: ChatMessage = {
  id: "msg-welcome",
  role: "chief",
  text: "I am your chief of staff. Once Google is connected I read your mail, calendar, tasks and files. Ask me anything.",
};

const URGENCY_ORDER: Record<Task["urgency"], number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

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
    const excerpt = fileHit.excerpt ? `\n\nKey excerpt: "${fileHit.excerpt}"` : "";
    return {
      text: `I read "${fileHit.name}". ${fileHit.summary}${excerpt}\n\nWant me to turn this into a task or a draft?`,
      sources: [fileHit.name],
    };
  }

  if (/(urgent|priority|today|first|now|what should i)/.test(q)) {
    const open = ctx.tasks
      .filter((t) => !t.done)
      .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]);
    if (open.length === 0) {
      return {
        text: "Nothing urgent on the task list right now. Check your calendar and inbox for the day's constraints.",
        sources: ["Today · tasks"],
      };
    }
    const lines = open
      .slice(0, 4)
      .map((t, i) => `${i + 1}. ${t.title} — ${t.due}`);
    return {
      text: `Here is the order of operations:\n\n${lines.join("\n")}`,
      sources: ["Today · tasks"],
    };
  }

  if (/(objective|goal|progress|status|on track)/.test(q)) {
    if (ctx.objectives.length === 0) {
      return {
        text: "No objectives yet. Create one on the Objectives page and I will track progress from there.",
        sources: ["Objectives"],
      };
    }
    const lines = ctx.objectives.map(
      (o) => `• ${o.title} — ${progressOf(o)}% · due ${o.deadline}`,
    );
    const weakest = [...ctx.objectives].sort((a, b) => progressOf(a) - progressOf(b))[0];
    return {
      text: `Current objectives:\n\n${lines.join("\n")}\n\nWeakest link: ${weakest.title} at ${progressOf(weakest)}%. That is where I would push today.`,
      sources: ["Objectives"],
    };
  }

  if (/(tomorrow|plan|schedule|check-?in|yesterday)/.test(q)) {
    const last = ctx.checkins[ctx.checkins.length - 1];
    if (!last) {
      return {
        text: "No check-in yet. Start one from the dashboard and I will use it to shape tomorrow.",
        sources: ["Evening check-in"],
      };
    }
    return {
      text: `From your last check-in:\n\nWorked: ${last.worked}\nStuck: ${last.stuck}\nTomorrow: ${last.tomorrow}\n\nThat last line is already sitting on your task list.`,
      sources: ["Evening check-in"],
    };
  }

  if (/(write|draft|post|newsletter|content)/.test(q)) {
    return {
      text: "Open Content Studio and give me a topic. I will draft it under your voice rules: calm, direct, no hype.",
      sources: ["Content Studio"],
    };
  }

  if (/(search|find|where|which file|look)/.test(q)) {
    if (ctx.files.length === 0) {
      return {
        text: "Your second brain is empty. Connect Google and I will index your Drive files.",
        sources: ["Second brain"],
      };
    }
    const term = q.replace(/^(search|find|where|which file|look for|for)\s*/g, "");
    const hits = ctx.files.filter(
      (f) => f.name.toLowerCase().includes(term) || f.tags.some((t) => q.includes(t)),
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
    text: `I checked your world: ${openTasks} open tasks, ${ctx.files.length} files indexed, ${ctx.objectives.length} objectives in flight.\n\nAsk me to search your files, draft content, summarize an objective, or plan tomorrow.`,
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
