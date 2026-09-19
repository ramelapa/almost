import { z } from "zod";
import { ExperienceTypeSchema } from "./experience";

export const ExperienceRouterInputSchema = z.object({
  prompt: z.string().min(1, "Please tell us what you are craving"),
  intensity: z.number().min(1).max(5).default(3),
});

export type ExperienceRouterInput = z.infer<typeof ExperienceRouterInputSchema>;

export const ExperienceRouterOutputSchema = z.object({
  experienceType: ExperienceTypeSchema,
  title: z.string(),
  intent: z.string(),
  mood: z.string(),
  intensity: z.number().min(1).max(5),
  duration: z.number(), // estimated minutes, e.g. 2 - 7
  theme: z.string(),
  suggestedPrompt: z.string().optional(),
});

export type ExperienceRouterOutput = z.infer<typeof ExperienceRouterOutputSchema>;
