import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "./StatCard";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Products" value={7} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders the hint when provided", () => {
    render(<StatCard label="Points" value="50" hint="From recycling" />);
    expect(screen.getByText("From recycling")).toBeInTheDocument();
  });

  it("omits the hint when not provided", () => {
    render(<StatCard label="Users" value={3} />);
    expect(screen.queryByText("From recycling")).not.toBeInTheDocument();
  });
});
