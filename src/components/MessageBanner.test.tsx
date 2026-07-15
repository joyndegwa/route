import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MessageBanner from "./MessageBanner";

describe("MessageBanner", () => {
  it("exposes error messages as alerts", () => {
    render(<MessageBanner tone="error">Unable to save</MessageBanner>);

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to save");
  });

  it("does not assign alert semantics to status messages", () => {
    render(<MessageBanner tone="success">Saved</MessageBanner>);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });
});
