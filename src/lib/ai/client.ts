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
      timeout: 45_000, // 45s hard timeout on all requests
    });
  }
  return client;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const maxRetries = 2; // Reduced from 3 — each attempt can take 45s
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[Claude API] Attempt ${attempt + 1}/${maxRetries}...`);
      const response = await getClient().messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      console.log(`[Claude API] Success, response length: ${textBlock?.text?.length ?? 0}`);
      return textBlock?.text ?? "";
    } catch (e) {
      lastError = e as Error;
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[Claude API] Attempt ${attempt + 1} failed: ${msg}`);
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  throw lastError || new Error("Claude API failed after retries");
}
