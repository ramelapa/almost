import { describe, it, expect } from "vitest";
import { MockLLMProvider } from "@/packages/ai-provider/mock-provider";

describe("Experience Router & AI Director Routing", () => {
  const provider = new MockLLMProvider();

  it("routes supercar craving to zero-cart", () => {
    const route = provider.routePrompt("I want to drive an absurdly expensive sports car", 4);
    expect(route.experienceType).toBe("zero-cart");
    expect(route.intensity).toBe(4);
  });

  it("routes luxury watch craving to zero-cart", () => {
    const route = provider.routePrompt("I need a gold Rolex tourbillon watch", 3);
    expect(route.experienceType).toBe("zero-cart");
  });

  it("routes Switzerland travel desire to dream-trip", () => {
    const route = provider.routePrompt("I wish I could escape to Switzerland", 3);
    expect(route.experienceType).toBe("dream-trip");
  });

  it("routes exhaustion and peace seeking to five-minute-escape", () => {
    const route = provider.routePrompt("I feel exhausted and want somewhere peaceful", 2);
    expect(route.experienceType).toBe("five-minute-escape");
  });

  it("routes billion dollar spending to billion-dollar mode", () => {
    const route = provider.routePrompt("I want to spend a billion dollars right now", 5);
    expect(route.experienceType).toBe("billion-dollar");
    expect(route.intensity).toBe(5);
  });

  it("routes impulse temptation to quit-cart", () => {
    const route = provider.routePrompt("I almost bought a $1,499 phone", 3);
    expect(route.experienceType).toBe("quit-cart");
  });

  it("falls back safely for unknown/unsupported inputs to closest relevant experience", () => {
    const route = provider.routePrompt("something completely random and abstract", 3);
    expect(["zero-cart", "dream-trip", "five-minute-escape", "billion-dollar", "quit-cart"]).toContain(
      route.experienceType
    );
  });
});
