import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MockLLMProvider } from "@/packages/ai-provider/mock-provider";
import { ZeroCartRenderer } from "@/packages/experience-engine/renderers/ZeroCartRenderer";
import { DreamTripRenderer } from "@/packages/experience-engine/renderers/DreamTripRenderer";
import { FiveMinuteEscapeRenderer } from "@/packages/experience-engine/renderers/FiveMinuteEscapeRenderer";
import { BillionDollarRenderer } from "@/packages/experience-engine/renderers/BillionDollarRenderer";
import { QuitCartRenderer } from "@/packages/experience-engine/renderers/QuitCartRenderer";
import { ShareCardModal } from "@/packages/ui/ShareCardModal";
import { SoundProvider } from "@/packages/sound-engine";
import { normalizeMuseumItem } from "@/lib/storage";

describe("Experience State & Personalization Suite", () => {
  const provider = new MockLLMProvider();

  describe("ZeroCart Authoritative Experience State", () => {
    it("derives dynamic total from base price and selected upgrades ($33,000 upgrades case)", async () => {
      const carExp = provider.generateExperienceForPrompt("Aurelius X9 Hypercar");

      // Render ZeroCart
      render(
        <SoundProvider>
          <ZeroCartRenderer experience={carExp} />
        </SoundProvider>
      );

      // Enter simulation from scene stage to customize stage
      const enterBtn = screen.getByRole("button", { name: /Enter the Simulation/i });
      fireEvent.click(enterBtn);

      // Find the upgrade buttons: Track telemetry ($15,000) and Carbon aero ($18,000) => totaling $33,000
      const aeroOption = await screen.findByRole("checkbox", { name: /Active Carbon-Fiber Aero Pack/i });
      const telemetryOption = await screen.findByRole("checkbox", { name: /Track Telemetry & Ceramic Brakes/i });

      // Base price is $241,300
      expect(screen.getAllByText(/\$241,300/i).length).toBeGreaterThan(0);

      // Select first upgrade ($18,000)
      fireEvent.click(aeroOption);
      expect(aeroOption).toHaveAttribute("aria-checked", "true");

      // Select second upgrade ($15,000) -> sum of upgrades is $33,000
      fireEvent.click(telemetryOption);
      expect(telemetryOption).toHaveAttribute("aria-checked", "true");

      // Customization total is base ($241,300) + upgrades ($33,000) = $274,300
      expect(screen.getAllByText(/\$274,300/i).length).toBeGreaterThan(0);

      // Advance to Cart stage
      const continueBtn = screen.getByRole("button", { name: /Proceed to Review/i });
      fireEvent.click(continueBtn);

      // Cart stage should explicitly itemize the upgrades total as $33,000 and total as $274,300
      expect(await screen.findByText(/\+\$33,000/i)).toBeInTheDocument();
      expect(screen.getAllByText(/\$274,300/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/\$0\.00/i)).toBeInTheDocument();
    });

    it("allows adding and removing an upgrade before review with accurate total update", async () => {
      const carExp = provider.generateExperienceForPrompt("Aurelius X9 Hypercar");

      render(
        <SoundProvider>
          <ZeroCartRenderer experience={carExp} />
        </SoundProvider>
      );

      const enterBtn = screen.getByRole("button", { name: /Enter the Simulation/i });
      fireEvent.click(enterBtn);

      const aeroOption = await screen.findByRole("checkbox", { name: /Active Carbon-Fiber Aero Pack/i });

      // Add aero pack ($18,000) -> total $259,300
      fireEvent.click(aeroOption);
      expect(screen.getAllByText(/\$259,300/i).length).toBeGreaterThan(0);

      // Remove aero pack -> total returns to $241,300
      fireEvent.click(aeroOption);
      expect(screen.getAllByText(/\$241,300/i).length).toBeGreaterThan(0);
    });

    it("properly differentiates telescope prompt from sports car (no mountain image or exhaust)", () => {
      const telescopeExp = provider.generateExperienceForPrompt("I want a professional telescope for observing distant galaxies");

      expect(telescopeExp.title).toMatch(/Telescope|Observatory|Refractor/i);
      expect(telescopeExp.theme.background).toBe("celestial-deep-space");

      // Verify options are astronomy-specific, NEVER automotive
      const allOptionLabels = telescopeExp.stages
        .flatMap((s) => s.options || [])
        .map((o) => o.label);

      expect(allOptionLabels.some((l) => /Aperture|Camera|Mount|Optics/i.test(l))).toBe(true);
      expect(allOptionLabels.some((l) => /Exhaust|Turbo|Brakes|Wheels|Hypercar/i.test(l))).toBe(false);

      // Verify media URL is an astronomy/deep space image, not a mountain or car
      const mediaUrl = telescopeExp.stages[0]?.media?.url || "";
      expect(mediaUrl).toContain("photo-1451187580459-43490279c0fa");
    });
  });

  describe("DreamTrip Multi-Day Itinerary Model", () => {
    it("maintains independent selections for Day 1, Day 2, and Day 3 without erasing other days", async () => {
      const tripExp = provider.generateExperienceForPrompt("A winter chalet trip in Switzerland");

      render(
        <SoundProvider>
          <DreamTripRenderer experience={tripExp} />
        </SoundProvider>
      );

      // Select flight stage -> click Confirm Choice
      const continueFlightBtn = screen.getByRole("button", { name: /Confirm Choice/i });
      fireEvent.click(continueFlightBtn);

      // Select hotel stage -> click Confirm Choice
      const continueHotelBtn = await screen.findByRole("button", { name: /Confirm Choice/i });
      fireEvent.click(continueHotelBtn);

      // Now at multi-day itinerary stage
      expect(await screen.findByRole("heading", { name: /Craft Your 3-Day Highlights/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Day 1/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Day 2/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Day 3/i })).toBeInTheDocument();

      // Find day 1, 2, 3 radio buttons
      const day1Radios = screen.getAllByRole("radio").filter((b) =>
        b.textContent?.includes("Lucerne") || b.textContent?.includes("Old Town")
      );
      const day2Radios = screen.getAllByRole("radio").filter((b) =>
        b.textContent?.includes("Jungfraujoch") || b.textContent?.includes("Glacier")
      );
      const day3Radios = screen.getAllByRole("radio").filter((b) =>
        b.textContent?.includes("Paragliding") || b.textContent?.includes("Thermal")
      );

      // Select Day 1 option 2
      if (day1Radios[1]) fireEvent.click(day1Radios[1]);
      // Select Day 2 option 2
      if (day2Radios[1]) fireEvent.click(day2Radios[1]);
      // Select Day 3 option 2
      if (day3Radios[1]) fireEvent.click(day3Radios[1]);

      // Proceed to review
      const reviewBtn = screen.getByRole("button", { name: /Review Complete Expedition/i });
      fireEvent.click(reviewBtn);

      // Review stage shows all 3 days
      expect(await screen.findByText(/Your Complete Expedition/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Day 1/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Day 2/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Day 3/i).length).toBeGreaterThan(0);
    });
  });

  describe("Five-Minute Escape Timer & Resilience", () => {
    it("initializes with 300 seconds (05:00) by default and supports early exit", async () => {
      const escapeExp = {
        id: "test-escape",
        type: "five-minute-escape" as const,
        title: "Kyoto Rain Café",
        subtitle: "Quiet interlude",
        theme: { style: "zen-minimal" as const, intensity: 1, background: "rain" as const, accentColor: "#06b6d4" },
        stages: [
          {
            id: "stage-scene",
            type: "scene" as const,
            title: "Tranquil Rain",
            description: "Listen to the rain.",
          },
          {
            id: "stage-reflection",
            type: "reflection" as const,
            title: "Interlude Complete",
          },
        ],
        conclusion: {
          headline: "Five quiet minutes",
          message: "You took time for yourself.",
          fictionalPrice: 8.5,
          avoidedAmount: 8.5,
          stats: [],
        },
      };

      render(
        <SoundProvider>
          <FiveMinuteEscapeRenderer experience={escapeExp} initialDurationSeconds={300} />
        </SoundProvider>
      );

      // Default timer shows 05:00
      expect(screen.getByText("05:00")).toBeInTheDocument();

      // Early exit button is present and clickable
      const exitBtn = screen.getByRole("button", { name: /Conclude Quiet Session/i });
      expect(exitBtn).toBeInTheDocument();
      fireEvent.click(exitBtn);

      // Moves to reflection stage
      expect(await screen.findByText(/Five quiet minutes/i)).toBeInTheDocument();
    });

    it("accurately completes when timer reaches zero after configured duration", async () => {
      const escapeExp = {
        id: "test-escape",
        type: "five-minute-escape" as const,
        title: "Kyoto Rain Café",
        subtitle: "Quiet interlude",
        theme: { style: "zen-minimal" as const, intensity: 1, background: "rain" as const, accentColor: "#06b6d4" },
        stages: [
          {
            id: "stage-scene",
            type: "scene" as const,
            title: "Tranquil Rain",
            description: "Listen to the rain.",
          },
          {
            id: "stage-reflection",
            type: "reflection" as const,
            title: "Interlude Complete",
          },
        ],
        conclusion: {
          headline: "Five quiet minutes",
          message: "You took time for yourself.",
          fictionalPrice: 8.5,
          avoidedAmount: 8.5,
          stats: [],
        },
      };

      render(
        <SoundProvider>
          <FiveMinuteEscapeRenderer experience={escapeExp} initialDurationSeconds={1} />
        </SoundProvider>
      );

      expect(screen.getByText("00:01")).toBeInTheDocument();
      expect(await screen.findByText(/Five quiet minutes/i, {}, { timeout: 4000 })).toBeInTheDocument();
    });
  });

  describe("Billion Dollar Mode Initial State & Overspending Prevention", () => {
    const billionExp = {
      id: "test-billion",
      type: "billion-dollar" as const,
      title: "Billion Dollar Spree",
      subtitle: "Spend $1B",
      theme: { style: "gold-monolith" as const, intensity: 5, background: "midnight-gold" as const, accentColor: "#fbbf24" },
      stages: [
        {
          id: "stage-spree",
          type: "choice" as const,
          title: "Extravagance Catalog",
        },
        {
          id: "stage-checkout",
          type: "checkout" as const,
          title: "Transfer",
        },
        {
          id: "stage-reflection",
          type: "reflection" as const,
          title: "Receipt",
        },
      ],
      conclusion: {
        headline: "Spree Complete",
        message: "You spent imaginary funds.",
        fictionalPrice: 0,
        avoidedAmount: 0,
        stats: [],
      },
    };

    it("starts with $1,000,000,000 balance, $0 spent, and no preselected items", () => {
      render(
        <SoundProvider>
          <BillionDollarRenderer experience={billionExp} />
        </SoundProvider>
      );

      // Initial state checks
      expect(screen.getByText("$1,000,000,000")).toBeInTheDocument();
      expect(screen.getByText("$0")).toBeInTheDocument();
      expect(screen.getByText("$0.00")).toBeInTheDocument();

      // Check all quantity indicators are 0
      const zeroQtys = screen.getAllByText("0");
      expect(zeroQtys.length).toBeGreaterThan(0);

      // Submit button should be disabled when $0 is spent
      const transferBtn = screen.getByRole("button", { name: /Authorize Fictional Wire Transfer/i });
      expect(transferBtn).toBeDisabled();
    });

    it("provides accessible button names and prevents overspending beyond $1,000,000,000", () => {
      render(
        <SoundProvider>
          <BillionDollarRenderer experience={billionExp} />
        </SoundProvider>
      );

      // Accessible plus button name
      const addClubBtn = screen.getByRole("button", {
        name: /Add one Premier League Historic Football Club/i,
      });
      expect(addClubBtn).toBeInTheDocument();

      // Football club is $420M. Add twice = $840M spent, $160M remaining
      fireEvent.click(addClubBtn);
      fireEvent.click(addClubBtn);
      expect(screen.getByText("$840,000,000")).toBeInTheDocument();
      expect(screen.getByText("$160,000,000")).toBeInTheDocument();

      // Third click would cost $420M which exceeds $160M remaining balance -> button must be disabled!
      expect(addClubBtn).toBeDisabled();

      // Minus button restores the balance
      const removeClubBtn = screen.getByRole("button", {
        name: /Remove one Premier League Historic Football Club/i,
      });
      fireEvent.click(removeClubBtn);
      expect(screen.getAllByText("$420,000,000").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("$580,000,000")).toBeInTheDocument();
    });
  });

  describe("QuitCart Initial State & Stated Price Handling", () => {
    it("starts with 0 preselected upgrades", () => {
      const quitExp = provider.generateExperienceForPrompt("I want to cancel a $1,499 phone");

      render(
        <SoundProvider>
          <QuitCartRenderer experience={quitExp} />
        </SoundProvider>
      );

      // All upgrade checkboxes should start unchecked
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((cb) => {
        expect(cb).toHaveAttribute("aria-checked", "false");
      });
    });

    it("carries user-stated price through cancellation and separates fictional cart", async () => {
      const quitExp = provider.generateExperienceForPrompt("I want to stop myself from buying a $1,499 camera");

      expect(quitExp.metadata?.userStatedPrice).toBe(1499);
      expect(quitExp.metadata?.hasUserStatedPrice).toBe(true);

      render(
        <SoundProvider>
          <QuitCartRenderer experience={quitExp} />
        </SoundProvider>
      );

      // Select an upgrade ($300)
      const upgrade = screen.getByRole("checkbox", { name: /1TB Ultra Capacity Tier/i });
      fireEvent.click(upgrade);

      // Continue to checkout
      const continueBtn = screen.getByRole("button", { name: /Proceed to Review/i });
      fireEvent.click(continueBtn);

      // Authorize simulated checkout to reach reflection
      const cancelBtn = await screen.findByRole("button", { name: /COMMIT TO THE PURCHASE/i });
      fireEvent.click(cancelBtn);

      // Cancellation banner appears exactly once
      expect(await screen.findByText(/ORDER CANCELED SUCCESSFULLY/i)).toBeInTheDocument();
      // User kept the $1,499 they stated
      expect(screen.getByText(/You kept your \$1,499/i)).toBeInTheDocument();
      // Fictional cart includes upgrade: $1,499 + $300 = $1,799
      expect(screen.getByText(/\$1,799/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility & Dialog Semantics", () => {
    it("renders ShareCardModal with role=dialog, aria-modal=true, Escape key support, and accessible close button", () => {
      const handleClose = vi.fn();
      render(
        <SoundProvider>
          <ShareCardModal
            isOpen={true}
            onClose={handleClose}
            experienceTitle="Alpine Cloud Expedition"
            experienceType="DreamTrip"
            fictionalPrice={28400}
          />
        </SoundProvider>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");

      const closeBtn = screen.getByRole("button", { name: /Close share dialog/i });
      expect(closeBtn).toBeInTheDocument();

      // Press Escape to close
      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe("Legacy Copy Normalization in Storage", () => {
    it("normalizes legacy entries claiming 'Your wallet saved $8.50' to 'Your wallet kept $8.50'", () => {
      const legacyItem = {
        id: "legacy-1",
        sessionId: "s1",
        experienceId: "e1",
        experienceType: "five-minute-escape" as const,
        title: "Kyoto Café",
        fictionalPrice: 8.5,
        avoidedAmount: 8.5,
        createdAt: new Date().toISOString(),
        reflectionQuote: "Your drink will never arrive. Your wallet saved $8.50. You gained five quiet minutes.",
        stats: [],
        tags: [],
      };

      const normalized = normalizeMuseumItem(legacyItem);
      expect(normalized.reflectionQuote).not.toContain("wallet saved $8.50");
      expect(normalized.reflectionQuote).toContain("wallet kept $8.50");
    });
  });
});
