import { builtinModels } from "@earendil-works/pi-ai/providers/all";

export const models = builtinModels();

export function listModels() {
  return models.getAllModels();
}
