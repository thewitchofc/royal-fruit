import { describe, expect, it } from "vitest";
import type { CartLine } from "../cart/types";
import { estimateCartTotal, estimateLineBreakdown, parseBundleDeal } from "./cartEstimate";

function line(partial: Partial<CartLine> & Pick<CartLine, "qty">): CartLine {
  return {
    id: "test",
    emoji: "🥬",
    name: "שעועית ירוקה מארז",
    priceLabel: "20 ₪",
    categoryPath: "ירקות",
    ...partial,
  };
}

describe("parseBundleDeal", () => {
  it("parses Hebrew bundle deals", () => {
    expect(parseBundleDeal("2 ב-30")).toEqual({ bundleQty: 2, bundlePrice: 30 });
    expect(parseBundleDeal("2 ב-25₪")).toEqual({ bundleQty: 2, bundlePrice: 25 });
    expect(parseBundleDeal("2 ב-40 ₪")).toEqual({ bundleQty: 2, bundlePrice: 40 });
    expect(parseBundleDeal("2 ב\u05BE30")).toEqual({ bundleQty: 2, bundlePrice: 30 });
    expect(parseBundleDeal("2 ב 30 ₪")).toEqual({ bundleQty: 2, bundlePrice: 30 });
  });

  it("returns null for empty or invalid deals", () => {
    expect(parseBundleDeal("")).toBeNull();
    expect(parseBundleDeal("מבצע מיוחד")).toBeNull();
  });
});

describe("estimateLineBreakdown", () => {
  it("applies bundle pricing for full bundles", () => {
    const result = estimateLineBreakdown(line({ qty: 2, deal: "2 ב-30 ₪" }));
    expect(result.total).toBe(30);
    expect(result.bundleCount).toBe(1);
    expect(result.remainderQty).toBe(0);
  });

  it("applies maqaf-style deals from Google Sheets", () => {
    const result = estimateLineBreakdown(line({ qty: 2, deal: "2 ב\u05BE30" }));
    expect(result.total).toBe(30);
    expect(result.bundleCount).toBe(1);
  });

  it("mixes bundle and regular unit price for partial bundles", () => {
    const result = estimateLineBreakdown(line({ qty: 3, deal: "2 ב-30 ₪" }));
    expect(result.total).toBe(50);
    expect(result.bundleCount).toBe(1);
    expect(result.remainderQty).toBe(1);
  });

  it("falls back to unit price when no deal is set", () => {
    const result = estimateLineBreakdown(line({ qty: 2 }));
    expect(result.total).toBe(40);
    expect(result.bundleCount).toBe(0);
  });
});

describe("estimateCartTotal", () => {
  it("sums deal and non-deal lines", () => {
    const total = estimateCartTotal([
      line({ qty: 2, deal: "2 ב-30 ₪" }),
      line({ id: "b", name: "נענע", priceLabel: "5 ₪", qty: 2 }),
    ]);
    expect(total.knownTotal).toBe(40);
    expect(total.dealLineCount).toBe(1);
  });
});
