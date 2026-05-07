import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { App } from "./main";

describe("Sek Labs company site", () => {
  it("renders Apple-review relevant company details", () => {
    render(<App />);

    expect(screen.getAllByText(/Sek Labs LLC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Independent software studio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BrickReports/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tally/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Washington, United States/i)).toBeInTheDocument();
    expect(screen.getAllByText(/support@sek-labs.com/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of use/i)).toBeInTheDocument();
    expect(screen.getByText(/Cookie notice/i)).toBeInTheDocument();
  });
});
