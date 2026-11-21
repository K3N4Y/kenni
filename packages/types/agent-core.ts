import type { AssistantMessage } from "@earendil-works/pi-ai";
import type { SubmissionRecord } from "@earendil-works/pi-durable";

export type Request = { instruction: string } & (
  | { sessionId?: undefined; provider: string; model: string; cwd?: string }
  | { sessionId: number; provider?: never; model?: never; cwd?: never }
);

export type ConversationResult =
  | { status: "done"; sessionId: number; answer: AssistantMessage }
  | {
      status: "unanswered";
      sessionId: number;
      reason: string;
      detail?: Exclude<SubmissionRecord["detail"], undefined>;
    }
  | { status: "not_found"; sessionId: number };

