import { describe, it, expect } from "vitest";
import { getAssistantReply } from "./assistant";
import { RECYCLE_POINTS_PER_ITEM } from "../utils/constants";

describe("getAssistantReply", () => {
  it("prompts for input on an empty message", () => {
    expect(getAssistantReply("   ")).toMatch(/ask me anything/i);
  });

  it("greets on hello", () => {
    expect(getAssistantReply("Hello there")).toMatch(/assistant/i);
  });

  it("explains recycling and includes the points value", () => {
    const reply = getAssistantReply("How do I recycle a product?");
    expect(reply.toLowerCase()).toContain("recycl");
    expect(reply).toContain(String(RECYCLE_POINTS_PER_ITEM));
  });

  it("explains passports/QR", () => {
    expect(getAssistantReply("Tell me about the QR passport")).toMatch(
      /passport/i,
    );
  });

  it("explains repairs", () => {
    expect(getAssistantReply("my device is broken")).toMatch(/repair/i);
  });

  it("explains registration", () => {
    expect(getAssistantReply("how do I sign up?")).toMatch(/register|account/i);
  });

  it("falls back for unrelated input", () => {
    expect(getAssistantReply("what's the weather on mars")).toMatch(
      /not sure/i,
    );
  });

  it("prefers the most specific intent by keyword weight", () => {
    const reply = getAssistantReply("what is re-trace about");
    expect(reply.toLowerCase()).toContain("digital product passport");
  });
});
