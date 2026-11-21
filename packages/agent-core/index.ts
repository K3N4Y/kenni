import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import { builtinModels } from "@earendil-works/pi-ai/providers/all";
import { AssistantEntry, createRegistry, Harness } from "@earendil-works/pi-durable";
import { NodeExecutionEnv } from "@earendil-works/pi-durable/env/node";
import { openNodeSqliteStorage } from "@earendil-works/pi-durable/storage/sqlite/node";
import { CodingTools } from "@earendil-works/pi-durable/tools";
import { homedir } from "node:os"
import { join } from "node:path";

const models = builtinModels();
const context = BACKGROUND_CONTEXT;

const registry = createRegistry();
registry.install(CodingTools);

const harness = await Harness.open(
    await openNodeSqliteStorage(join(homedir(), ".kenni", "agent.sqlite")),
    {
        models,
        registry,
        env: ({ cwd }) => new NodeExecutionEnv({ cwd: cwd ?? process.cwd() }),
    },
    context,
);

const session = await harness.root(context, {
    agent: {
        model: { provider: "openai", modelId: "gpt-6-luna" },
        cwd: process.cwd(),
    },
});

const submission = await session.submit(
    { type: "input", content: "Read the readme and resume it for me" },
    context,
);

const result = await submission.wait(context);

if (result.status === "done" && result.type === "input") {
    const answer = await session.commit(
        (tx) => tx.entry(AssistantEntry, result.answer),
        context,
    );

    console.log(answer?.model?.[0]);
} else {
    console.error(result)
}
