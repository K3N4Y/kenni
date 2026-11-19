import { builtinModels } from "@earendil-works/pi-ai/providers/all";

export const defaultModel = { provider: "openai-codex", modelId: "gpt-6-luna" };

export function createAgentModels() {
  return builtinModels();
}
