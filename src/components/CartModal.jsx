import { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateQuantity, clearCart } from '../utils/cart';

export default function CartModal({ open, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (open) setItems(getCart());
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleRemove = (id) => setItems(removeFromCart(id));
  const handleChange = (id, q) => setItems(updateQuantity(id, Number(q)));
  const handleClear = () => { clearCart(); setItems([]); };

  const parsePrice = (p) => {
    if (typeof p === 'number') return p;
    if (!p) return 0;
    let s = String(p).replace(/[^0-9.,-]/g, '');
    if (s.includes(',') && s.includes('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes('.') && !s.includes(',')) {
      // assume dots are thousands separators
      s = s.replace(/\./g, '');
    } else if (s.includes(',') && !s.includes('.')) {
      // comma as decimal
      s = s.replace(/,/g, '.');
    }
    return Number(s) || 0;
  };

  const formatCLP = (n) => {
    try {
      return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(Math.round(n));
    } catch (e) {
      // fallback
      return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  };

  const total = items.reduce((s, it) => s + (parsePrice(it.price) * Number(it.quantity || 1)), 0);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" role="document">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar diálogo">×</button>
        <h3>Carrito ({items.length})</h3>

        {items.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div style={{ display: 'grid', gap: '.6rem' }}>
            {items.map(it => (
              <div key={it.id} style={{ display: 'flex', gap: '.6rem', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '.5rem' }}>
                <img src={it.image} alt={it.title} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <div><strong>{it.title}</strong></div>
                  <div className="precio">{formatCLP(parsePrice(it.price))} x {it.quantity} — Sub: {formatCLP(parsePrice(it.price) * Number(it.quantity || 1))}</div>
                </div>
                <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                  <button className="btn" onClick={() => handleChange(it.id, Math.max(0, (it.quantity || 1) - 1))}>−</button>
                  <input aria-label={`cantidad-${it.id}`} value={it.quantity || 1} onChange={(e) => handleChange(it.id, e.target.value)} style={{ width: 48, textAlign: 'center', padding: '.4rem', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)' }} />
                  <button className="btn" onClick={() => handleChange(it.id, (it.quantity || 1) + 1)}>+</button>
                  <button className="btn" onClick={() => handleRemove(it.id)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>Borrar</button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.5rem' }}>
              <strong>Total:</strong>
              <strong>{formatCLP(total)}</strong>
            </div>

            <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={handleClear}>Vaciar</button>
              <button className="btn" onClick={() => { alert('Checkout simulado'); }} >Pagar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
