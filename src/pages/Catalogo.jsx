import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/products';

export default function Catalogo() {
  const products = getProducts();

  return (
    <div>
      <section id="catalogo" className="section">
        <header className="section-header"><h2>Catálogo</h2></header>
        <div className="grid">
          {products.map(prod => <ProductCard key={prod.id} {...{ id: prod.id, title: prod.title, image: prod.image, description: prod.description || prod.desc, price: prod.price }} />)}
        </div>
      </section>
    </div>
  );
}