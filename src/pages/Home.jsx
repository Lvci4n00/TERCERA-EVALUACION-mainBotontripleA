import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/products';

export default function Home() {
  const products = getProducts().filter((prod) => !prod.id.startsWith('o'));
  const gpuProducts = products.filter((prod) => /geforce|radeon|rtx|rx|gpu|gtx/i.test(prod.title));
  const cpuProducts = products.filter((prod) => /ryzen|intel core|procesador|cpu/i.test(prod.title));

  return (
    <section id="inicio" className="section">
      <h2>Bienvenido a Hardware Hub</h2>
      <Carousel />
      <p>Tu página confiable de componentes para computadora: en Hardware Hub ofrecemos una selección curada de piezas nuevas y reacondicionadas, guías de compatibilidad, comparativas y soporte técnico experto para ayudarte a elegir la mejor configuración según tu uso.</p>
      <div className="spacer" aria-hidden="true" />

      <header className="section-header"><h2>GPU</h2></header>
      <div className="grid">
        {gpuProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            {...{ id: prod.id, title: prod.title, image: prod.image, description: prod.description || prod.desc, price: prod.price }}
          />
        ))}
      </div>

      <div className="spacer" aria-hidden="true" />

      <header className="section-header"><h2>CPU</h2></header>
      <div className="grid">
        {cpuProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            {...{ id: prod.id, title: prod.title, image: prod.image, description: prod.description || prod.desc, price: prod.price }}
          />
        ))}
      </div>
    </section>
  );
}