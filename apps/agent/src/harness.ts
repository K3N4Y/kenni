import { fileURLToPath } from "node:url";
import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import { createRegistry, Harness } from "@earendil-works/pi-durable";
import { openNodeJsonlStorage } from "@earendil-works/pi-durable/storage/jsonl/node";
import { createAgentModels } from "./models.ts";

export async function openAgentHarness(session: string) {
  const directory = fileURLToPath(new URL(`../.data/sessions/${session}`, import.meta.url));
  const storage = await openNodeJsonlStorage(directory, BACKGROUND_CONTEXT);
  return Harness.open(
    storage,
    { models: createAgentModels(), registry: createRegistry() },
    BACKGROUND_CONTEXT,
  );
}
