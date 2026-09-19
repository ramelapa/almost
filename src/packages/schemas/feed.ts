import { z } from "zod";
import { ExperienceTypeSchema } from "./experience";

export const FeedItemSchema = z.object({
  id: z.string(),
  location: z.string(),
  message: z.string(),
  experienceType: ExperienceTypeSchema,
  avoidedAmount: z.number().default(0),
  meTooCount: z.number().default(0),
  timestamp: z.string(),
  isDemo: z.boolean().default(false),
});

export type FeedItem = z.infer<typeof FeedItemSchema>;
