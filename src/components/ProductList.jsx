import { useEffect, useState } from 'react';
import { getProducts, removeProduct } from '../utils/products';
import ProductItem from './ProductItem';

export default function ProductList({ onEdit }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getProducts());
    const onUpdate = () => setItems(getProducts());
    window.addEventListener('products-updated', onUpdate);
    return () => window.removeEventListener('products-updated', onUpdate);
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Eliminar producto?')) return;
    removeProduct(id);
    setItems(getProducts());
  };

  return (
    <section aria-labelledby="products-list-title">
      <h3 id="products-list-title">Productos ({items.length})</h3>
      <ul role="list" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', listStyle: 'none', padding: 0 }}>
        {items.map(it => (
          <li key={it.id} role="listitem">
            <ProductItem item={it} onEdit={onEdit} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </section>
  );
}
