import { describe, it, expect, beforeEach } from "vitest";
import { getLocalMuseumItems, addLocalMuseumItem, getLocalMuseumSummary, getSessionId } from "@/lib/storage";

describe("Storage & Museum Management", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("generates an anonymous session ID", () => {
    const id = getSessionId();
    expect(id).toBeDefined();
    expect(id.startsWith("session_")).toBe(true);
  });

  it("adds and retrieves items from Museum", () => {
    const newItem = {
      id: "test-museum-1",
      sessionId: "session-1",
      experienceId: "exp-1",
      experienceType: "zero-cart" as const,
      title: "Test Hypercar",
      fictionalPrice: 300000,
      avoidedAmount: 300000,
      createdAt: new Date().toISOString(),
      stats: [],
      tags: [],
    };

    addLocalMuseumItem(newItem);
    const items = getLocalMuseumItems();
    expect(items.some((i) => i.id === "test-museum-1")).toBe(true);

    const summary = getLocalMuseumSummary();
    expect(summary.thingsNotBoughtCount).toBeGreaterThanOrEqual(1);
    expect(summary.imaginarySpendingAvoided).toBeGreaterThanOrEqual(300000);
  });
});
