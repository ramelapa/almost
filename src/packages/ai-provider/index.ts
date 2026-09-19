import { LLMProvider } from "./types";
import { MockLLMProvider } from "./mock-provider";
import { OpenAICompatibleProvider } from "./openai-compatible";

export * from "./types";
export * from "./mock-provider";
export * from "./openai-compatible";

export function getLLMProvider(): LLMProvider {
  const providerType = (process.env.AI_PROVIDER || "mock").toLowerCase();

  if (providerType === "openai" || providerType === "ollama" || providerType === "groq") {
    return new OpenAICompatibleProvider();
  }

  return new MockLLMProvider();
}
