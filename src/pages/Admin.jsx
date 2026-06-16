import { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

export default function Admin() {
  const [editing, setEditing] = useState(null);

  return (
    <main className="container" role="main" aria-labelledby="admin-title" style={{ marginTop: '1rem' }}>
      <header className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 id="admin-title">Administrador de productos</h2>
        <div>
          <button className="btn" onClick={() => { setEditing(null); setTimeout(() => document.getElementById('pf-title')?.focus(), 50); }}>Nuevo producto</button>
        </div>
      </header>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px' }}>
          <ProductForm editing={editing} onSaved={() => setEditing(null)} />
        </div>
        <div style={{ flex: '2 1 420px' }}>
          <ProductList onEdit={(p) => setEditing(p)} />
        </div>
      </div>
    </main>
  );
}
