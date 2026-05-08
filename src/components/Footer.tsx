const CURRENT_YEAR = new Date().getFullYear();

const POLICY_LINKS = [
  { href: "mailto:support@sek-labs.com?subject=Privacy%20request", label: "Privacy" },
  { href: "mailto:support@sek-labs.com?subject=Terms%20question", label: "Terms" },
  { href: "mailto:support@sek-labs.com?subject=Cookie%20question", label: "Cookies" },
] as const;

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <strong>Sek Labs LLC</strong>
          <span>&copy; {CURRENT_YEAR} All rights reserved.</span>
        </div>
        <nav className="footer-links" aria-label="Company links">
          {POLICY_LINKS.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
          <a href="mailto:support@sek-labs.com">support@sek-labs.com</a>
        </nav>
      </div>
    </footer>
  );
}

export { Footer };
