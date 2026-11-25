import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

export async function renderTUI(instruction?: string) {
  const renderer = await createCliRenderer();

  createRoot(renderer).render(<text>{instruction}</text>);
}
