import { z } from "zod";

export const ExperienceTypeSchema = z.enum([
  "zero-cart",
  "dream-trip",
  "five-minute-escape",
  "billion-dollar",
  "quit-cart",
]);

export type ExperienceType = z.infer<typeof ExperienceTypeSchema>;

export const MediaAssetSchema = z.object({
  type: z.enum(["image", "gradient", "video", "canvas"]),
  url: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const ExperienceOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  price: z.number().default(0), // Fictional or avoided price
  category: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  highlight: z.string().optional(),
});

export type ExperienceOption = z.infer<typeof ExperienceOptionSchema>;

export const StatSchema = z.object({
  label: z.string(),
  value: z.string(),
  unit: z.string().optional(),
  highlight: z.boolean().optional(),
});

export type Stat = z.infer<typeof StatSchema>;

export const StageTypeSchema = z.enum([
  "choice",
  "scene",
  "customize",
  "cart",
  "checkout",
  "reflection",
]);

export type StageType = z.infer<typeof StageTypeSchema>;

export const ExperienceStageSchema = z.object({
  id: z.string(),
  type: StageTypeSchema,
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  options: z.array(ExperienceOptionSchema).optional(),
  media: MediaAssetSchema.optional(),
  customData: z.record(z.string(), z.any()).optional(),
});

export type ExperienceStage = z.infer<typeof ExperienceStageSchema>;

export const ExperienceThemeSchema = z.object({
  style: z.string().default("luxury-futuristic"),
  intensity: z.number().min(1).max(5).default(3),
  background: z.string().default("obsidian"),
  accentColor: z.string().default("#3b82f6"),
});

export type ExperienceTheme = z.infer<typeof ExperienceThemeSchema>;

export const ExperienceConclusionSchema = z.object({
  headline: z.string(),
  message: z.string(),
  stats: z.array(StatSchema).default([]),
  avoidedAmount: z.number().default(0),
  fictionalPrice: z.number().default(0),
  certificateTitle: z.string().optional(),
  meTooPrompt: z.string().optional(),
});

export type ExperienceConclusion = z.infer<typeof ExperienceConclusionSchema>;

export const ExperienceSchema = z.object({
  id: z.string(),
  type: ExperienceTypeSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  theme: ExperienceThemeSchema,
  stages: z.array(ExperienceStageSchema),
  conclusion: ExperienceConclusionSchema,
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
