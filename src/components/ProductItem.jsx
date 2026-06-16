export default function ProductItem({ item, onEdit, onDelete }) {
  return (
    <div role="group" aria-labelledby={`prod-${item.id}-title`} style={{ display: 'flex', gap: '.6rem', alignItems: 'center', padding: '.5rem', border: '1px solid var(--border)', borderRadius: 8 }}>
      <img src={item.image} alt={item.title} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
      <div style={{ flex: 1 }}>
        <div id={`prod-${item.id}-title`}><strong>{item.title}</strong></div>
        <div className="precio">{item.price}</div>
      </div>
      <div style={{ display: 'flex', gap: '.4rem' }}>
        <button className="btn" onClick={() => onEdit(item)} aria-label={`Editar ${item.title}`}>Editar</button>
        <button className="btn" onClick={() => onDelete(item.id)} aria-label={`Borrar ${item.title}`} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>Borrar</button>
      </div>
    </div>
  );
}
