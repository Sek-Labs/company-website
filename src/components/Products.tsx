interface Product {
  readonly name: string;
  readonly status: string;
  readonly description: string;
  readonly href: string;
  readonly linkLabel: string;
}

interface ProductsProps {
  readonly products: readonly Product[];
}

function Products({ products }: ProductsProps) {
  return (
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
            <a href={product.href} aria-label={product.linkLabel}>
              {product.linkLabel} →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export { Products };
export type { Product };
