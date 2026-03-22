import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getApiKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  if (process.env.ANTHROPIC_KEY_REV) {
    return process.env.ANTHROPIC_KEY_REV.split("").reverse().join("");
  }
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: getApiKey(),
      timeout: 60_000, // 60s timeout per request
    });
  }
  return client;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  // Single attempt — no retries to avoid doubling time budget
  try {
    const response = await getClient().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return textBlock?.text ?? "";
  } catch (e) {
    console.error("Claude API call failed:", e);
    throw e;
  }
}
