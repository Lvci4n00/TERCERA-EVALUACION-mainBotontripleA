import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/products';

export default function Ofertas() {
  const ofertas = getProducts().filter((prod) => prod.id.startsWith('o'));

  return (
    <section id="ofertas" className="section">
      <header className="section-header"><h2>Computadores</h2></header>
      <p>Revisa nuestras promociones y descuentos especiales.</p>
      <div className="grid">
        {ofertas.map(prod => (
          <ProductCard
            key={prod.id}
            {...{ id: prod.id, title: prod.title, image: prod.image, description: prod.description || prod.desc, price: prod.price }}
          />
        ))}
      </div>
    </section>
  );
}