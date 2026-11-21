# agent-core

## Use the package

Import `openAgent` from `agent-core` in Bun or in the Electron main process.
`openAgent()` uses `~/.kenni/agent.sqlite` in both applications. Close the agent
in one application before you open it in the other. The database does not
support two `Harness` writers at the same time. Set credentials in the process
that opens the agent. For example, set `OPENAI_API_KEY` for `openai`.

```ts
import { openAgent } from "agent-core";

const agent = await openAgent();
try {
  const first = await agent.conversation({
    provider: "openai",
    model: "chat-latest",
    cwd: workspacePath,
    instruction: "Summarize this project.",
  });

  if (first.status === "done") {
    const next = await agent.conversation({
      sessionId: first.sessionId,
      instruction: "How do you run it?",
    });
    // Pass next to the app interface.
  }
} finally {
  await agent.close();
}
```

To resume a conversation, send only `sessionId` and `instruction`. The
conversation keeps the model and directory that you selected when you created
it. If there is no response, the result is `unanswered` and includes `reason`
and `sessionId`. If the session does not exist in that database, the result is
`not_found`.

Import the `Request` and `ConversationResult` types from
`@repo/types/agent-core`.

## Check the types

```bash
bun check
```
