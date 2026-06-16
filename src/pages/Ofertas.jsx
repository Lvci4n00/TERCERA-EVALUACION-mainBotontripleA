import ProductCard from '../components/ProductCard';

export default function Ofertas() {
  const ofertas = [
    { id: 'o1', title: 'PC Escritorio Gamer Alpha', image: '/images/PC1.png', desc: 'Intel Core i5, 16GB RAM, GTX 1660, 512GB SSD.', price: '$1.250.000' },
    { id: 'o6', title: 'PC Hatsune Miku Edition', image: '/images/PC HATSUNE MIKU.png', desc: 'Edición temática con gran rendimiento.', price: '$1.990.000' }
  ];

  return (
    <section id="ofertas" className="section">
      <header className="section-header"><h2>Ofertas Especiales</h2></header>
      <p>Revisa nuestras promociones y descuentos especiales.</p>
      <div className="grid">
        {ofertas.map(prod => <ProductCard key={prod.id} {...prod} />)}
      </div>
    </section>
  );
}