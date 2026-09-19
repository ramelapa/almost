import { z } from "zod";
import { LLMProvider } from "./types";
import { MockLLMProvider } from "./mock-provider";

export class OpenAICompatibleProvider implements LLMProvider {
  name = "openai-compatible";
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private fallback: MockLLMProvider;

  constructor(apiKey?: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey || process.env.AI_API_KEY || "";
    this.baseUrl = baseUrl || process.env.AI_BASE_URL || "https://api.openai.com/v1";
    this.model = model || process.env.AI_MODEL || "gpt-4o-mini";
    this.fallback = new MockLLMProvider();
  }

  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemPrompt?: string
  ): Promise<T> {
    if (!this.apiKey && !this.baseUrl.includes("localhost") && !this.baseUrl.includes("127.0.0.1")) {
      // Graceful fallback to mock if no API key is provided for non-local endpoints
      return this.fallback.generateStructured(prompt, schema, systemPrompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                (systemPrompt || "You are the AI Director for ALMOST, an experiential website where users simulate aspirational experiences.") +
                "\nYou MUST respond with valid JSON matching the requested schema.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.warn(`[AI-Provider] HTTP error ${response.status}. Falling back to mock generator.`);
        return this.fallback.generateStructured(prompt, schema, systemPrompt);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        return this.fallback.generateStructured(prompt, schema, systemPrompt);
      }

      const parsed = JSON.parse(content);
      const validated = schema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      } else {
        console.warn("[AI-Provider] Schema validation mismatch. Falling back to mock generator.", validated.error);
        return this.fallback.generateStructured(prompt, schema, systemPrompt);
      }
    } catch (err) {
      console.warn("[AI-Provider] Exception occurred. Falling back to mock generator.", err);
      return this.fallback.generateStructured(prompt, schema, systemPrompt);
    }
  }
}
