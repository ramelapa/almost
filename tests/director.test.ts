import { describe, it, expect } from "vitest";
import { aiDirector } from "@/packages/ai-director";
import { ExperienceSchema } from "@/packages/schemas";

describe("AIDirector End-to-End Generation", () => {
  it("generates a valid ZeroCart experience conforming to schema", async () => {
    const exp = await aiDirector.direct("I want an absurdly expensive sports car", 4);
    const parsed = ExperienceSchema.safeParse(exp);
    expect(parsed.success).toBe(true);
    expect(exp.type).toBe("zero-cart");
    expect(exp.stages.length).toBeGreaterThanOrEqual(4);
    expect(exp.conclusion.avoidedAmount).toBeGreaterThan(0);
  });

  it("generates a valid DreamTrip experience with custom flight and hotel", async () => {
    const exp = await aiDirector.direct("I want to visit Switzerland", 3);
    const parsed = ExperienceSchema.safeParse(exp);
    expect(parsed.success).toBe(true);
    expect(exp.type).toBe("dream-trip");
    expect(exp.metadata?.destination).toBeDefined();
  });

  it("generates a valid FiveMinuteEscape experience with relaxing options", async () => {
    const exp = await aiDirector.direct("I need five minutes away from everything", 1);
    const parsed = ExperienceSchema.safeParse(exp);
    expect(parsed.success).toBe(true);
    expect(exp.type).toBe("five-minute-escape");
    expect(exp.conclusion.stats.find((s) => s.label.includes("Quiet"))).toBeDefined();
  });

  it("generates a valid BillionDollar experience with catalog", async () => {
    const exp = await aiDirector.direct("I want to spend a billion dollars", 5);
    const parsed = ExperienceSchema.safeParse(exp);
    expect(parsed.success).toBe(true);
    expect(exp.type).toBe("billion-dollar");
  });

  it("generates a valid QuitCart experience extracting numerical dollar amounts", async () => {
    const exp = await aiDirector.direct("I almost bought a $2,499 mirrorless camera", 3);
    const parsed = ExperienceSchema.safeParse(exp);
    expect(parsed.success).toBe(true);
    expect(exp.type).toBe("quit-cart");
    expect(exp.conclusion.avoidedAmount).toBe(2499);
  });
});
