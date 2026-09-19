import { z } from "zod";
import { ExperienceTypeSchema } from "./experience";

export const MuseumItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  experienceId: z.string(),
  experienceType: ExperienceTypeSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  fictionalPrice: z.number().default(0),
  avoidedAmount: z.number().default(0),
  imageUrl: z.string().optional(),
  createdAt: z.string(), // ISO string
  reflectionQuote: z.string().optional(),
  stats: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).default([]),
  tags: z.array(z.string()).default([]),
});

export type MuseumItem = z.infer<typeof MuseumItemSchema>;

export const MuseumSummarySchema = z.object({
  thingsNotBoughtCount: z.number().default(0),
  imaginarySpendingAvoided: z.number().default(0),
  curiosityMomentsExperienced: z.number().default(0),
});

export type MuseumSummary = z.infer<typeof MuseumSummarySchema>;
