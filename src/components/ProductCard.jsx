import { useState } from 'react';
import { addToCart } from '../utils/cart';
import { fetchSpecsByQuery } from '../utils/techspecs';

export default function ProductCard({ id, title, image, description, price }) {
  const [showSpecs, setShowSpecs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState(null);

  const handleAdd = () => {
    addToCart({ id, title, image, price });
    window.dispatchEvent(new CustomEvent('cart-updated'));
    alert('Producto agregado al carrito');
  };

  async function toggleSpecs(){
    const next = !showSpecs;
    setShowSpecs(next);
    if (next && !specs) {
      setLoading(true);
      try {
        const res = await fetchSpecsByQuery([title, description].filter(Boolean).join(' '));
        setSpecs(res);
      } catch (e) {
        setSpecs(null);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <article className="producto" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <img src={image} alt={title} loading="lazy" width="300" />
      <p>{description}</p>
      <p className="precio"><strong>Precio:</strong> {price}</p>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <button type="button" className="btn" onClick={handleAdd}>Agregar al carrito</button>
        <button type="button" className="btn" onClick={toggleSpecs} aria-expanded={showSpecs}>{showSpecs ? 'Ocultar specs' : 'Specs'}</button>
      </div>

      {showSpecs && (
        <div style={{ marginTop: '.6rem', borderTop: '1px dashed var(--border)', paddingTop: '.5rem' }}>
          {loading && <div>Buscando especificaciones...</div>}
          {!loading && specs && (
            <div>
              <div style={{ fontWeight: 700 }}>{specs.name || specs.title}</div>
              {specs.category && <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Categoría: {specs.category}</div>}
              {specs.specs && typeof specs.specs === 'object' && (
                <ul style={{ margin: '.5rem 0 0 0', paddingLeft: '1rem' }}>
                  {Object.entries(specs.specs).slice(0,6).map(([k,v]) => (
                    <li key={k}><strong>{k}:</strong> {String(v)}</li>
                  ))}
                </ul>
              )}
              {!specs.specs && specs?.url && <div>Encontrado: <a href={specs.url} target="_blank" rel="noreferrer">ver en BuildCores</a></div>}
            </div>
          )}
          {!loading && !specs && <div>No se encontraron especificaciones.</div>}
        </div>
      )}
    </article>
  );
}