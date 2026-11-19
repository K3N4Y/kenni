import process from "node:process";
import { parseArgs } from "node:util";
import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import { AssistantEntry } from "@earendil-works/pi-durable";
import { openAgentHarness } from "./harness.ts";
import { defaultModel } from "./models.ts";

const usage = 'Uso desde la raíz: bun run agent [--session nombre] "mensaje"';

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      session: { type: "string", default: "default" },
    },
    allowPositionals: true,
  });
  if (values.help) {
    console.log(usage);
    console.log(
      "Requiere OPENAI_API_KEY. Repite el nombre de sesión para continuar la conversación.",
    );
    return;
  }

  const prompt = positionals.join(" ").trim();
  if (!prompt) throw new Error(usage);
  const session = values.session;
  if (!/^[a-zA-Z0-9_-]+$/.test(session)) {
    throw new Error(
      "El nombre de sesión solo admite letras ASCII, números, guiones y guiones bajos.",
    );
  }
  if (!process.env.OPENAI_API_KEY?.trim()) {
    throw new Error("Define OPENAI_API_KEY antes de ejecutar el agente.");
  }

  const context = BACKGROUND_CONTEXT;
  const harness = await openAgentHarness(session);
  try {
    const conversation = await harness.root(context, { agent: { model: defaultModel } });
    harness.resume();
    const submission = await conversation.submit({ type: "input", content: prompt }, context);
    const result = await submission.wait(context);
    if (result.status !== "done" || result.type !== "input") {
      const detail = result.detail === undefined ? "" : `: ${JSON.stringify(result.detail)}`;
      throw new Error(`El agente no respondió (${result.reason ?? result.status})${detail}`);
    }

    const entry = await conversation.commit(
      (tx) => tx.entry(AssistantEntry, result.answer),
      context,
    );
    const message = entry?.model?.find((message) => message.role === "assistant");
    const text = message?.content
      .flatMap((part) => (part.type === "text" ? [part.text] : []))
      .join("");
    if (!text) throw new Error("El modelo no devolvió texto.");
    console.log(text);
  } finally {
    await harness.close(context);
  }
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
