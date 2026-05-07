import "./styles.css";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Products } from "./components/Products";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import type { Product } from "./components/Products";

const products: readonly Product[] = [
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
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Products products={products} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export { App };
