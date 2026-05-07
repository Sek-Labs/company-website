function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-inner">
        <p className="eyebrow">Independent software studio</p>
        <h1>Clear answers for the decisions that matter.</h1>
        <p className="hero-copy">
          We build focused tools that turn messy real-world information into
          something you can actually use — whether you are signing a lease or
          tracking where your money goes.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#products">View products</a>
          <a className="button secondary" href="mailto:support@sek-labs.com">Contact support</a>
        </div>
      </div>
    </section>
  );
}

export { Hero };
