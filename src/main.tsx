import React from "react";
import "./styles.css";

const products = [
  {
    name: "BrickReports",
    status: "Live product",
    description:
      "Rental due-diligence reports that help New York City renters understand building quality, complaint history, and risk signals before signing a lease.",
    href: "https://brickreports.com",
    linkLabel: "Visit BrickReports",
  },
  {
    name: "Tally",
    status: "In development",
    description:
      "A personal finance product focused on helping people understand cash flow, habits, and everyday financial decisions with less friction.",
    href: "https://tallyfinances.com/",
    linkLabel: "Visit Tally",
  },
];

function App() {
  return (
    <main>
      <header className="site-header" aria-label="Sek Labs navigation">
        <a className="brand" href="#top" aria-label="Sek Labs home">
          <span className="brand-mark" aria-hidden="true">SL</span>
          <span>Sek Labs LLC</span>
        </a>
        <nav>
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#policies">Policies</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Independent software studio</p>
          <h1>Practical software for better everyday decisions.</h1>
          <p className="hero-copy">
            Sek Labs LLC builds focused consumer and productivity tools that turn messy real-world information into clear, useful workflows.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#products">View products</a>
            <a className="button secondary" href="mailto:support@sek-labs.com">Contact support</a>
          </div>
        </div>
      </section>

      <section id="about" className="section split">
        <div>
          <p className="eyebrow">About</p>
          <h2>Small, deliberate, product-led.</h2>
        </div>
        <p>
          Sek Labs LLC is a Washington limited liability company creating software products for renters, personal finance, and practical decision support. We prefer simple interfaces, trustworthy data, and products that solve concrete problems.
        </p>
      </section>

      <section id="products" className="section">
        <p className="eyebrow">Products</p>
        <h2>Current work</h2>
        <div className="cards">
          {products.map((product) => (
            <article className="card" key={product.name}>
              <div className="card-header">
                <h3>{product.name}</h3>
                <span>{product.status}</span>
              </div>
              <p>{product.description}</p>
              <a href={product.href} aria-label={product.linkLabel}>{product.linkLabel} →</a>
            </article>
          ))}
        </div>
      </section>

      <section id="policies" className="section legal-grid">
        <article id="privacy">
          <p className="eyebrow">Privacy</p>
          <h2>Privacy policy</h2>
          <p>
            Sek Labs products collect only the information needed to operate, secure, support, and improve each product. We do not sell personal information. Product-specific privacy notices are provided where a product requires account, payment, or financial functionality.
          </p>
        </article>
        <article id="terms">
          <p className="eyebrow">Terms</p>
          <h2>Terms of use</h2>
          <p>
            Use of Sek Labs products is governed by the terms presented in each product experience. Products in development may be limited, experimental, or invite-only until formal terms are published.
          </p>
        </article>
        <article id="cookies">
          <p className="eyebrow">Cookies</p>
          <h2>Cookie notice</h2>
          <p>
            This company website does not require a cookie banner because it does not set non-essential cookies or run behavioral advertising. Individual Sek Labs products may publish separate cookie or tracking notices if their functionality requires them.
          </p>
        </article>
        <article>
          <p className="eyebrow">Apple developer enrollment</p>
          <h2>Organization details</h2>
          <p>
            Public company website for Sek Labs LLC, including legal name, product links, support contact, and policy summaries for organization verification workflows.
          </p>
        </article>
      </section>

      <section id="contact" className="section contact">
        <p className="eyebrow">Contact</p>
        <h2>Company information</h2>
        <dl>
          <div><dt>Legal name</dt><dd>Sek Labs LLC</dd></div>
          <div><dt>Business type</dt><dd>Independent software studio</dd></div>
          <div><dt>Jurisdiction</dt><dd>Washington, United States</dd></div>
          <div><dt>Support email</dt><dd><a href="mailto:support@sek-labs.com">support@sek-labs.com</a></dd></div>
        </dl>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Sek Labs LLC. All rights reserved.</span>
        <a href="mailto:support@sek-labs.com">support@sek-labs.com</a>
      </footer>
    </main>
  );
}

export { App };
