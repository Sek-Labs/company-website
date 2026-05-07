import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { App } from "./main";

describe("Sek Labs company site", () => {
  it("renders Apple-review relevant company details", () => {
    render(<App />);

    expect(screen.getAllByText(/Sek Labs LLC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Independent software studio/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/BrickReports/i)).toBeInTheDocument();
    expect(screen.getByText(/Tally/i)).toBeInTheDocument();
    expect(screen.getByText(/Washington, United States/i)).toBeInTheDocument();
    expect(screen.getAllByText(/hello@sek-labs.com/i).length).toBeGreaterThan(0);
  });
});
