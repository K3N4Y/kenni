import { fileURLToPath } from "node:url";
import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import type { Models } from "@earendil-works/pi-ai/models";
import { createRegistry, Harness } from "@earendil-works/pi-durable";
import { openNodeJsonlStorage } from "@earendil-works/pi-durable/storage/jsonl/node";

export async function openAgentHarness(session: string, models: Models) {
  const directory = fileURLToPath(new URL(`../.data/sessions/${session}`, import.meta.url));
  const storage = await openNodeJsonlStorage(directory, BACKGROUND_CONTEXT);
  return Harness.open(storage, { models, registry: createRegistry() }, BACKGROUND_CONTEXT);
}
