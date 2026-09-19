import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DopamineDial } from "@/packages/ui/DopamineDial";
import { BoardingPass } from "@/packages/ui/BoardingPass";
import { BillionaireReceipt } from "@/packages/ui/BillionaireReceipt";
import { InvestmentGrowthCard } from "@/packages/ui/InvestmentGrowthCard";
import { SoundProvider } from "@/packages/sound-engine";

describe("UI Components Suite", () => {
  it("renders DopamineDial and calls onChange on level selection", () => {
    const handleChange = vi.fn();
    render(
      <SoundProvider>
        <DopamineDial value={3} onChange={handleChange} />
      </SoundProvider>
    );

    expect(screen.getByText(/Dopamine Dial/i)).toBeInTheDocument();
    expect(screen.getByText(/3 — Fun/i)).toBeInTheDocument();

    const calmButton = screen.getByLabelText(/Set intensity level to 1/i);
    fireEvent.click(calmButton);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("renders BoardingPass with $0.00 cost and fictional warnings", () => {
    render(
      <BoardingPass
        passengerName="RAM"
        destination="SWITZERLAND"
        origin="WASHINGTON (IAD)"
        cost="$0.00"
      />
    );

    expect(screen.getByText("RAM")).toBeInTheDocument();
    expect(screen.getByText("SWITZERLAND")).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText(/NON-COMMERCIAL TICKET/i)).toBeInTheDocument();
    expect(screen.getByText(/NOT A VALID TRAVEL DOCUMENT/i)).toBeInTheDocument();
  });

  it("renders BillionaireReceipt with starting balance, spent sum, and $0 real damage", () => {
    render(
      <BillionaireReceipt
        startingBalance={1000000000}
        spentAmount={843220000}
        purchasedItems={[
          { label: "Sovereign Island", price: 145000000 },
          { label: "Mega Yacht", price: 320000000 },
        ]}
      />
    );

    expect(screen.getByText(/ALMOST TRUST CO/i)).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Island/i)).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000,000")).toBeInTheDocument();
  });

  it("renders InvestmentGrowthCard with compounding calculation and educational disclaimer", () => {
    render(<InvestmentGrowthCard amountSaved={1499} assumedAnnualRate={0.07} />);

    expect(screen.getByText(/What your \$1,499 could become/i)).toBeInTheDocument();
    expect(screen.getByText(/In 10 Years/i)).toBeInTheDocument();
    expect(screen.getByText(/Hypothetical Illustration/i)).toBeInTheDocument();
  });
});
