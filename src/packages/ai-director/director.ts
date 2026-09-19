import { getLLMProvider } from "../ai-provider";
import {
  Experience,
  ExperienceRouterOutput,
  ExperienceRouterOutputSchema,
  ExperienceSchema,
} from "../schemas";
import { ROUTER_PROMPT, SYSTEM_DIRECTOR_PROMPT } from "./prompts";
import { MockLLMProvider } from "../ai-provider/mock-provider";

export class AIDirector {
  private fallbackProvider = new MockLLMProvider();

  async route(prompt: string, intensity = 3): Promise<ExperienceRouterOutput> {
    const provider = getLLMProvider();
    const routerPromptText = ROUTER_PROMPT(prompt, intensity);

    try {
      const result = await provider.generateStructured(
        routerPromptText,
        ExperienceRouterOutputSchema,
        SYSTEM_DIRECTOR_PROMPT
      );
      return result;
    } catch (err) {
      console.warn("[AIDirector] Routing error, utilizing deterministic fallback router.", err);
      return this.fallbackProvider.routePrompt(prompt, intensity);
    }
  }

  async direct(prompt: string, intensity = 3): Promise<Experience> {
    const provider = getLLMProvider();
    const promptWithIntensity = `User prompt: "${prompt}". Intensity: ${intensity} / 5. Generate complete experience stages, custom options, and reflection statistics.`;

    try {
      const result = await provider.generateStructured(
        promptWithIntensity,
        ExperienceSchema,
        SYSTEM_DIRECTOR_PROMPT
      );

      // Enforce consistent ID and intensity
      result.theme.intensity = intensity;
      return result;
    } catch (err) {
      console.warn("[AIDirector] Directing error, utilizing deterministic fallback experience.", err);
      return this.fallbackProvider.generateExperienceForPrompt(prompt, intensity);
    }
  }
}

export const aiDirector = new AIDirector();
