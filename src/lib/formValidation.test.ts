import { describe, expect, it } from "vitest";
import {
  isPlausibleEmail,
  isPlausibleFullName,
  isPlausibleIsraeliPhone,
  normalizeIsraeliPhoneDigits,
} from "./formValidation";

describe("normalizeIsraeliPhoneDigits", () => {
  it("maps +972 to leading 0", () => {
    expect(normalizeIsraeliPhoneDigits("+972 50-123-4567")).toBe("0501234567");
  });
});

describe("isPlausibleIsraeliPhone", () => {
  it("accepts mobile 05x", () => {
    expect(isPlausibleIsraeliPhone("050-1234567")).toBe(true);
  });

  it("accepts 9-digit landline", () => {
    expect(isPlausibleIsraeliPhone("03-1234567")).toBe(true);
  });

  it("accepts mobile without leading 0", () => {
    expect(isPlausibleIsraeliPhone("501234567")).toBe(true);
  });

  it("rejects too short", () => {
    expect(isPlausibleIsraeliPhone("05123")).toBe(false);
  });
});

describe("isPlausibleEmail", () => {
  it("accepts simple valid email", () => {
    expect(isPlausibleEmail("a@b.co")).toBe(true);
  });

  it("rejects missing domain", () => {
    expect(isPlausibleEmail("not-an-email")).toBe(false);
  });
});

describe("isPlausibleFullName", () => {
  it("requires at least 2 chars", () => {
    expect(isPlausibleFullName("א")).toBe(false);
    expect(isPlausibleFullName("אב")).toBe(true);
  });
});
