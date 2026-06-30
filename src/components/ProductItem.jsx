import { useState } from 'react';
import { fetchSpecsByQuery } from '../utils/techspecs';

export default function ProductItem({ item, onEdit, onDelete }) {
  const [showSpecs, setShowSpecs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState(null);

  async function toggleSpecs(){
    const next = !showSpecs;
    setShowSpecs(next);
    if (next && !specs) {
      setLoading(true);
      try {
        const res = await fetchSpecsByQuery(item.title || item.id);
        setSpecs(res);
      } catch (e) {
        setSpecs(null);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div role="group" aria-labelledby={`prod-${item.id}-title`} style={{ display: 'flex', gap: '.6rem', alignItems: 'center', padding: '.5rem', border: '1px solid var(--border)', borderRadius: 8, flexDirection: 'column' }}>
      <div style={{ display: 'flex', width: '100%', gap: '.6rem', alignItems: 'center' }}>
        <img src={item.image} alt={item.title} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
        <div style={{ flex: 1 }}>
          <div id={`prod-${item.id}-title`}><strong>{item.title}</strong></div>
          <div className="precio">{item.price}</div>
        </div>
        <div style={{ display: 'flex', gap: '.4rem' }}>
          <button className="btn" onClick={() => onEdit(item)} aria-label={`Editar ${item.title}`}>Editar</button>
          <button className="btn" onClick={() => onDelete(item.id)} aria-label={`Borrar ${item.title}`} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>Borrar</button>
          <button className="btn" onClick={toggleSpecs} aria-expanded={showSpecs} aria-controls={`specs-${item.id}`}>{showSpecs ? 'Ocultar specs' : 'Specs'}</button>
        </div>
      </div>

      {showSpecs && (
        <div id={`specs-${item.id}`} style={{ marginTop: '.5rem', width: '100%', borderTop: '1px dashed var(--border)', paddingTop: '.5rem' }}>
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
              {!specs.specs && specs?.specs === undefined && specs.url && <div>Encontrado: <a href={specs.url} target="_blank" rel="noreferrer">ver en BuildCores</a></div>}
            </div>
          )}
          {!loading && !specs && <div>No se encontraron especificaciones.</div>}
        </div>
      )}
    </div>
  );
}
