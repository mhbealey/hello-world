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
    client = new Anthropic({ apiKey: getApiKey() });
  }
  return client;
}

const CLAUDE_TIMEOUT_MS = 60_000; // Increased for larger market scans

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1500
): Promise<string> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await Promise.race([
        getClient().messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Claude API timed out")), CLAUDE_TIMEOUT_MS)
        ),
      ]);

      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock?.text ?? "";
    } catch (e) {
      lastError = e as Error;
      console.error(`Claude API attempt ${attempt + 1} failed:`, e);
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  throw lastError || new Error("Claude API failed after retries");
}
