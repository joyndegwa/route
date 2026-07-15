import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./errors";

describe("getErrorMessage", () => {
  it("returns the message from an Error", () => {
    expect(getErrorMessage(new Error("Network unavailable"), "Fallback")).toBe(
      "Network unavailable",
    );
  });

  it("returns the fallback for non-Error values", () => {
    expect(getErrorMessage("Network unavailable", "Fallback")).toBe("Fallback");
  });
});
