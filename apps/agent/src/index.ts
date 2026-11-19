import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import { AssistantEntry, type ModelRef } from "@earendil-works/pi-durable";
import { openAgentHarness } from "./harness.ts";
import { createAgentModels } from "./models.ts";

export async function runAgent({
  prompt,
  session,
  model,
}: {
  prompt: string;
  session: string;
  model: ModelRef;
}) {
  const models = createAgentModels();
  if (!models.getModel(model.provider, model.modelId)) {
    throw new Error(`Unknown chat model: ${model.provider}/${model.modelId}`);
  }
  if (!(await models.checkAuth(model.provider))) {
    throw new Error(`No credentials configured for ${model.provider}.`);
  }
  const context = BACKGROUND_CONTEXT;
  const harness = await openAgentHarness(session, models);
  try {
    const conversation = await harness.root(context);
    await conversation.configure({ model }, context);
    harness.resume();
    const submission = await conversation.submit({ type: "input", content: prompt }, context);
    const result = await submission.wait(context);
    if (result.status !== "done" || result.type !== "input") {
      const detail = result.detail === undefined ? "" : `: ${JSON.stringify(result.detail)}`;
      throw new Error(`The agent did not respond (${result.reason ?? result.status})${detail}`);
    }

    const entry = await conversation.commit(
      (tx) => tx.entry(AssistantEntry, result.answer),
      context,
    );
    const message = entry?.model?.find((message) => message.role === "assistant");
    const text = message?.content
      .flatMap((part) => (part.type === "text" ? [part.text] : []))
      .join("");
    if (!text) throw new Error("The model did not return any text.");
    return text;
  } finally {
    await harness.close(context);
  }
}
