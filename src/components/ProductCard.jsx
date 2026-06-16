import { addToCart } from '../utils/cart';

export default function ProductCard({ id, title, image, description, price }) {
  const handleAdd = () => {
    addToCart({ id, title, image, price });
    // dispatch event so cart modal / navbar counters can update
    window.dispatchEvent(new CustomEvent('cart-updated'));
    alert('Producto agregado al carrito');
  };

  return (
    <article className="producto" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <img src={image} alt={title} loading="lazy" width="300" />
      <p>{description}</p>
      <p className="precio"><strong>Precio:</strong> {price}</p>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button type="button" className="btn" onClick={handleAdd}>Agregar al carrito</button>
      </div>
    </article>
  );
}