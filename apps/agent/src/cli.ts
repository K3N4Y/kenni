import { parseArgs } from "node:util";
import { runAgent } from "./index.ts";
import { defaultModel } from "./models.ts";

const usage = `
kenni v1.0.0

USAGE
    kenni [COMMAND]

ARGUMENTS
    MESSAGES Messages to send

FLAGS
    --model=<provider/model>  Model to use (exact with a provider: "openai-codex/gpt-6-luna")
`;

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      help: { type: "boolean" },
      model: { type: "string" },
      session: { type: "string", default: "default" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(usage);
    return;
  }

  const prompt = positionals.join(" ").trim();
  if (!prompt) throw new Error(usage);
  const session = values.session;
  if (!/^[a-zA-Z0-9_-]+$/.test(session)) {
    throw new Error(
      "Session names may contain only ASCII letters, digits, hyphens, and underscores.",
    );
  }
  let model = defaultModel;
  if (values.model !== undefined) {
    const separator = values.model.indexOf("/");
    if (separator <= 0 || separator === values.model.length - 1) {
      throw new Error("--model must be in provider/model format.");
    }
    model = {
      provider: values.model.slice(0, separator),
      modelId: values.model.slice(separator + 1),
    };
  }

  console.log(await runAgent({ prompt, session, model }));
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
