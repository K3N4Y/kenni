import { createModels } from "@earendil-works/pi-ai/models";
import { openaiProvider } from "@earendil-works/pi-ai/providers/openai";

export const defaultModel = { provider: "openai", modelId: "gpt-5-mini" };

export function createAgentModels() {
  const models = createModels();
  models.setProvider(openaiProvider());
  return models;
}
