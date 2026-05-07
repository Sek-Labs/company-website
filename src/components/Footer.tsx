const CURRENT_YEAR = new Date().getFullYear();

const POLICIES = [
  {
    id: "privacy",
    label: "Privacy:",
    text: "Sek Labs products collect only the information needed to operate, secure, support, and improve each product. We do not sell personal information.",
  },
  {
    id: "terms",
    label: "Terms:",
    text: "Use of Sek Labs products is governed by the terms presented in each product experience. Products in development may be limited, experimental, or invite-only.",
  },
  {
    id: "cookies",
    label: "Cookies:",
    text: "This company website does not set non-essential cookies or run behavioral advertising, so it does not require a cookie banner.",
  },
] as const;

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <span>&copy; {CURRENT_YEAR} Sek Labs LLC. All rights reserved.</span>
        <a href="mailto:support@sek-labs.com">support@sek-labs.com</a>
      </div>
      <nav className="footer-links" aria-label="Company policies">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#cookies">Cookies</a>
      </nav>
      <div className="footer-policies" id="policies">
        {POLICIES.map((policy) => (
          <details key={policy.id} id={policy.id}>
            <summary>{policy.label}</summary>
            <p>{policy.text}</p>
          </details>
        ))}
      </div>
    </footer>
  );
}

export { Footer };
