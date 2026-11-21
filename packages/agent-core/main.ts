import { homedir } from "node:os";
import { join } from "node:path";
import { BACKGROUND_CONTEXT as context } from "@earendil-works/chord/context";
import { AssistantEntry, Harness } from "@earendil-works/pi-durable";
import { models } from "./models";
import type { ConversationId } from "@earendil-works/pi-durable";
import { openNodeSqliteStorage } from "@earendil-works/pi-durable/storage/sqlite/node";
import { NodeExecutionEnv } from "@earendil-works/pi-durable/env/node";
import type { ConversationResult, Request } from "@repo/types/agent-core";
import { Registry } from "./registry";

export async function openAgent() {
  const registry = Registry();

  const harness = await Harness.open(
    await openNodeSqliteStorage(join(homedir(), ".kenni", "agent.sqlite")),
    {
      models,
      registry,
      env: ({ cwd }) => new NodeExecutionEnv({ cwd: cwd ?? process.cwd() }),
    },
    context,
  );

  return {
    async conversation(request: Request): Promise<ConversationResult> {
      let session;
      if (request.sessionId === undefined) {
        session = await harness.createConversation(
          {
            ownership: { kind: "ownerless" },
            agent: {
              model: { provider: request.provider, modelId: request.model },
              cwd: request.cwd ?? process.cwd(),
            },
          },
          context,
        );
      } else {
        session = await harness.conversation(request.sessionId as ConversationId, context);
        if (!session) {
          return { status: "not_found", sessionId: request.sessionId };
        }
      }

      const submission = await session.submit(
        { type: "input", content: request.instruction },
        context,
      );
      const result = await submission.wait(context);
      if (result.type !== "input") {
        throw new Error(`Expected an input receipt for submission ${result.id}`);
      }
      if (result.status === "unanswered") {
        const { reason, detail } = result;
        return {
          status: "unanswered",
          sessionId: session.id,
          reason,
          ...(detail === undefined ? {} : { detail }),
        };
      }

      const entry = await session.commit((tx) => tx.entry(AssistantEntry, result.answer), context);
      const answer = entry?.model?.[0];
      if (answer?.role !== "assistant") {
        throw new Error(`Missing assistant message for entry ${result.answer}`);
      }
      return { status: "done", sessionId: session.id, answer };
    },
    close: () => harness.close(context),
  };
}
