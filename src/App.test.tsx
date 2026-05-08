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
  });

  it("has a Tally link pointing to tallyfinances.com", () => {
    render(<App />);

    const tallyLink = screen.getByRole("link", { name: /Tally/i });
    expect(tallyLink).toHaveAttribute("href", "https://tallyfinances.com/");
  });

  it("has at least one mailto link for support@sek-labs.com", () => {
    const { container } = render(<App />);

    const mailtoLinks = container.querySelectorAll(
      'a[href="mailto:support@sek-labs.com"]'
    );
    expect(mailtoLinks.length).toBeGreaterThanOrEqual(1);
  });

  describe("landmark structure", () => {
    it("has a banner landmark (header)", () => {
      render(<App />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("has a main landmark", () => {
      render(<App />);

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("has a contentinfo landmark (footer)", () => {
      render(<App />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("does not nest header or footer inside main", () => {
      const { container } = render(<App />);

      const mainEl = container.querySelector("main");
      expect(mainEl).not.toBeNull();
      expect(mainEl!.querySelector("header")).toBeNull();
      expect(mainEl!.querySelector("footer")).toBeNull();
    });
  });

  it("keeps policy links compact in the footer", () => {
    render(<App />);

    const footerNav = screen.getByRole("navigation", {
      name: /Company links/i,
    });
    const links = Array.from(footerNav.querySelectorAll("a")).map((link) => link.textContent);

    expect(links).toEqual(expect.arrayContaining(["Privacy", "Terms", "Cookies", "support@sek-labs.com"]));
    expect(screen.queryByText(/This company website does not set non-essential cookies/i)).not.toBeInTheDocument();
  });

  it("does not apply card class to the contact section", () => {
    const { container } = render(<App />);

    const contactSection = container.querySelector(".contact");
    expect(contactSection).toBeInTheDocument();
    expect(contactSection).not.toHaveClass("card");
  });

  it("has a Tally product link with correct href in the products section", () => {
    const { container } = render(<App />);

    const productsSection = container.querySelector("#products");
    expect(productsSection).not.toBeNull();

    const tallyLink = productsSection!.querySelector(
      'a[href="https://tallyfinances.com/"]'
    );
    expect(tallyLink).not.toBeNull();
    expect(tallyLink!.textContent).toMatch(/Tally/i);
  });
});
