import { z } from "zod";

export interface LLMProvider {
  name: string;
  generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemPrompt?: string
  ): Promise<T>;
}

export interface AIProviderConfig {
  provider: "mock" | "openai" | "ollama" | "groq";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}
