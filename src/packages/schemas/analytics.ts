import { z } from "zod";
import { ExperienceTypeSchema } from "./experience";

export const AnalyticsEventNameSchema = z.enum([
  "experience_started",
  "experience_completed",
  "experience_abandoned",
  "experience_type",
  "experience_duration",
  "dopamine_dial_value",
  "museum_item_added",
  "share_created",
  "surprise_me_used",
]);

export type AnalyticsEventName = z.infer<typeof AnalyticsEventNameSchema>;

export const AnalyticsPayloadSchema = z.object({
  eventName: AnalyticsEventNameSchema,
  sessionId: z.string(),
  experienceId: z.string().optional(),
  experienceType: ExperienceTypeSchema.optional(),
  dopamineDialValue: z.number().min(1).max(5).optional(),
  durationSeconds: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  timestamp: z.string().default(() => new Date().toISOString()),
});

export type AnalyticsPayload = z.infer<typeof AnalyticsPayloadSchema>;
