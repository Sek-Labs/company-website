import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { App } from "./main";

describe("Sek Labs company site", () => {
  // ----------------------------------------------------------------
  // 1. Existing content assertions (keep all original checks)
  // ----------------------------------------------------------------
  it("renders Apple-review relevant company details", () => {
    render(<App />);

    expect(screen.getAllByText(/Sek Labs LLC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Independent software studio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BrickReports/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tally/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Washington, United States/i)).toBeInTheDocument();
    expect(screen.getAllByText(/support@sek-labs.com/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Privacy:/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cookies:/i)).toBeInTheDocument();
  });

  // ----------------------------------------------------------------
  // 2. Tally link points to tallyfinances.com
  // ----------------------------------------------------------------
  it("has a Tally link pointing to tallyfinances.com", () => {
    render(<App />);

    const tallyLink = screen.getByRole("link", { name: /Tally/i });
    expect(tallyLink).toHaveAttribute("href", "https://tallyfinances.com/");
  });

  // ----------------------------------------------------------------
  // 3. Support email is a mailto: link
  // ----------------------------------------------------------------
  it("has at least one mailto link for support@sek-labs.com", () => {
    const { container } = render(<App />);

    const mailtoLinks = container.querySelectorAll(
      'a[href="mailto:support@sek-labs.com"]'
    );
    expect(mailtoLinks.length).toBeGreaterThanOrEqual(1);
  });

  // ----------------------------------------------------------------
  // 4. Landmark structure (header/banner, main, footer/contentinfo)
  // ----------------------------------------------------------------
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

      // header and footer should be siblings of main, not descendants
      const headerInsideMain = mainEl!.querySelector("header");
      expect(headerInsideMain).toBeNull();

      const footerInsideMain = mainEl!.querySelector("footer");
      expect(footerInsideMain).toBeNull();
    });
  });

  // ----------------------------------------------------------------
  // 5. Footer policies use <details> elements
  // ----------------------------------------------------------------
  describe("footer policy details elements", () => {
    it("renders Privacy, Terms, and Cookies labels inside summary elements", () => {
      render(<App />);

      expect(
        screen.getByText(/Privacy:/i, { selector: "summary" })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Terms:/i, { selector: "summary" })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Cookies:/i, { selector: "summary" })
      ).toBeInTheDocument();
    });

    it("renders at least three details elements in the footer", () => {
      const { container } = render(<App />);

      const detailsElements = container.querySelectorAll("footer details");
      expect(detailsElements.length).toBeGreaterThanOrEqual(3);
    });

    it("has all policy details elements closed by default", () => {
      const { container } = render(<App />);

      const detailsElements = container.querySelectorAll("footer details");
      // Guard: ensure details elements actually exist before checking state
      expect(detailsElements.length).toBeGreaterThanOrEqual(3);
      detailsElements.forEach((el) => {
        expect(el).not.toHaveAttribute("open");
      });
    });
  });

  // ----------------------------------------------------------------
  // 6. Contact section is not a card
  // ----------------------------------------------------------------
  it("does not apply card class to the contact section", () => {
    const { container } = render(<App />);

    const contactSection = container.querySelector(".contact");
    expect(contactSection).toBeInTheDocument();
    expect(contactSection).not.toHaveClass("card");
  });

  // ----------------------------------------------------------------
  // 7. Tally href inside the Products section
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // 8. Footer nav policy links point to fragment anchors
  // ----------------------------------------------------------------
  it("has footer nav links with fragment hrefs for privacy, terms, and cookies", () => {
    render(<App />);

    const policyNav = screen.getByRole("navigation", {
      name: /Company policies/i,
    });
    const links = policyNav.querySelectorAll("a");

    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/^#/);
    });
  });
});
