import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  initials,
  productStatusLabel,
  recycleStatusLabel,
  repairStatusLabel,
  roleLabel,
  titleCase,
  truncate,
} from "./formatters";

describe("formatDate", () => {
  it("formats an ISO string", () => {
    expect(formatDate("2024-01-05T00:00:00Z")).toBe("Jan 5, 2024");
  });

  it("returns a dash for empty or invalid input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("accepts Date objects", () => {
    expect(formatDate(new Date("2024-12-25T00:00:00Z"))).toBe("Dec 25, 2024");
  });
});

describe("formatCurrency", () => {
  it("formats numbers as USD", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("returns a dash for nullish or NaN", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
    expect(formatCurrency(Number.NaN)).toBe("—");
  });
});

describe("titleCase", () => {
  it("converts snake_case and hyphens", () => {
    expect(titleCase("in_repair")).toBe("In Repair");
    expect(titleCase("digital-passport")).toBe("Digital Passport");
  });

  it("collapses extra whitespace", () => {
    expect(titleCase("  hello   world  ")).toBe("Hello World");
  });
});

describe("truncate", () => {
  it("leaves short strings untouched", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("truncates and appends an ellipsis", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcd…");
  });
});

describe("initials", () => {
  it("uses first and last name", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
  });

  it("handles single names", () => {
    expect(initials("Cher")).toBe("C");
  });

  it("returns a placeholder for empty input", () => {
    expect(initials("   ")).toBe("?");
  });
});

describe("label helpers", () => {
  it("maps known enum values to labels", () => {
    expect(productStatusLabel("in_repair")).toBe("In Repair");
    expect(repairStatusLabel("completed")).toBe("Completed");
    expect(recycleStatusLabel("processed")).toBe("Processed");
    expect(roleLabel("industry")).toBe("Industry Partner");
  });
});
