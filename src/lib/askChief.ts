import { getChiefReply, type ChiefContext } from "./chief";

const SYSTEM_PROMPT = [
  "You are the chief of staff inside Atlas, a personal command-center dashboard.",
  "Voice: calm, direct, professional. Short sentences. No hype, no emoji, no em-dashes.",
  "Answer using the user's actual data below (tasks, objectives, files, check-ins).",
  "Be concrete: name tasks and files, give the next action. Mention the source file name",
  "when a file is relevant. Keep answers under 130 words unless the user asks for detail.",
].join(" ");

function buildUserPrompt(message: string, ctx: ChiefContext): string {
  const tasks = ctx.tasks
    .slice(0, 20)
    .map((t) => `- [${t.urgency}${t.done ? ", done" : ""}] ${t.title} (${t.due})`)
    .join("\n");
  const objectives = ctx.objectives
    .slice(0, 8)
    .map((o) => {
      const pct = o.keyResults.length
        ? Math.round((o.keyResults.filter((k) => k.done).length / o.keyResults.length) * 100)
        : 0;
      return `- ${o.title} — ${pct}% — due ${o.deadline} — why: ${o.why}`;
    })
    .join("\n");
  const files = ctx.files
    .slice(0, 30)
    .map((f) => `- ${f.name} (${f.folder}): ${f.summary.slice(0, 160)}`)
    .join("\n");
  const checkins = ctx.checkins
    .slice(0, 3)
    .map((c) => `- Worked: ${c.worked} | Stuck: ${c.stuck} | Tomorrow: ${c.tomorrow}`)
    .join("\n");

  return [
    "TASKS:",
    tasks || "(none)",
    "",
    "OBJECTIVES:",
    objectives || "(none)",
    "",
    "FILES:",
    files || "(none)",
    "",
    "RECENT CHECK-INS:",
    checkins || "(none)",
    "",
    `MESSAGE FROM USER: ${message}`,
  ].join("\n");
}

async function askOpenAI(prompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 450,
      temperature: 0.4,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI empty response");
  return text;
}

async function askAnthropic(prompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
      max_tokens: 450,
      system: prompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = (await res.json()) as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error("Anthropic empty response");
  return text;
}

async function askGemini(prompt: string, userPrompt: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 450, temperature: 0.4 },
      }),
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini empty response");
  return text;
}

export async function respondToChief(
  message: string,
  ctx: ChiefContext,
): Promise<{ text: string; sources: string[]; engine: "llm" | "rules" }> {
  const userPrompt = buildUserPrompt(message, ctx);

  const providers: (() => Promise<string>)[] = [];
  if (process.env.OPENAI_API_KEY) providers.push(() => askOpenAI(SYSTEM_PROMPT, userPrompt));
  if (process.env.ANTHROPIC_API_KEY)
    providers.push(() => askAnthropic(SYSTEM_PROMPT, userPrompt));
  if (process.env.GEMINI_API_KEY) providers.push(() => askGemini(SYSTEM_PROMPT, userPrompt));

  for (const ask of providers) {
    try {
      const text = await ask();
      const cited = ctx.files
        .filter((f) => text.includes(f.name))
        .map((f) => f.name)
        .slice(0, 3);
      return { text, sources: cited.length ? cited : ["Chief of staff"], engine: "llm" };
    } catch {
      // try the next provider, then fall back to rules
    }
  }

  const rules = getChiefReply(message, ctx);
  return { ...rules, engine: "rules" };
}
