function Header() {
  return (
    <header className="site-header" aria-label="Sek Labs navigation">
      <a className="brand" href="#top" aria-label="Sek Labs home">
        <span className="brand-mark" aria-hidden="true">SL</span>
        <span>Sek Labs LLC</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export { Header };
