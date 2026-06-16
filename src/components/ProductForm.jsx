import { useEffect, useState, useRef } from 'react';
import { addProduct, updateProduct } from '../utils/products';

export default function ProductForm({ editing, onSaved }) {
  const [data, setData] = useState({ id: '', title: '', image: '', description: '', price: '' });
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [invalid, setInvalid] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setData(editing);
      setTimeout(() => titleRef.current?.focus(), 0);
    } else {
      setData({ id: '', title: '', image: '', description: '', price: '' });
    }
  }, [editing]);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...data };
    if (!payload.title) {
      setInvalid({ title: true });
      setStatusMsg({ text: 'El nombre es requerido.', type: 'error' });
      titleRef.current?.focus();
      return;
    }
    if (!payload.id) {
      // create id simple
      payload.id = `p${Date.now()}`;
      addProduct(payload);
      setStatusMsg({ text: 'Producto creado correctamente.', type: 'success' });
    } else {
      updateProduct(payload);
      setStatusMsg({ text: 'Producto actualizado correctamente.', type: 'success' });
    }
    onSaved?.();
    setData({ id: '', title: '', image: '', description: '', price: '' });
    setInvalid({});
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }} aria-labelledby="product-form-title">
      <h3 id="product-form-title">{data.id ? 'Editar producto' : 'Nuevo producto'}</h3>
      <label htmlFor="pf-title">Nombre</label>
      <input id="pf-title" ref={titleRef} name="title" value={data.title} onChange={handleChange} required aria-required="true" aria-invalid={!!invalid.title} />

      <label htmlFor="pf-image">Imagen (ruta)</label>
      <input id="pf-image" name="image" value={data.image} onChange={handleChange} />

      <label htmlFor="pf-description">Descripción</label>
      <textarea id="pf-description" name="description" value={data.description} onChange={handleChange} rows="3" />

      <label htmlFor="pf-price">Precio (ej. 250.000)</label>
      <input id="pf-price" name="price" value={data.price} onChange={handleChange} placeholder="250.000" inputMode="numeric" aria-describedby="pf-price-help" />
      <div id="pf-price-help" style={{ fontSize: '.9rem', color: 'var(--muted)' }}>Formato: solo números y puntos para miles (ej. 250.000)</div>

      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button className="btn" type="submit">Guardar</button>
        <button type="button" className="btn" onClick={() => setData({ id: '', title: '', image: '', description: '', price: '' })}>Limpiar</button>
      </div>
      <div role="status" aria-live="polite" style={{ minHeight: '1.4rem' }}>{statusMsg.text}</div>
    </form>
  );
}
