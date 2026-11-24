import type { CredentialStore } from "@earendil-works/pi-ai";
import { builtinModels } from "@earendil-works/pi-ai/providers/all";
import { authCredentials } from "./credential";

const credentials: CredentialStore = new authCredentials();

export const models = builtinModels({ credentials: credentials });

export function listModels() {
  return models.getAllModels();
}
