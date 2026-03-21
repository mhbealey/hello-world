import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
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
      lastError = e as Error;
      console.error(`Claude API attempt ${attempt + 1} failed:`, e);
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error("Claude API failed after retries");
}
