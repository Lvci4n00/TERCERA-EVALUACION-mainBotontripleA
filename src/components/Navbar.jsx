import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ onOpenAuth }) {
  const [user, setUser] = useState(null);
  const [isAaaMode, setIsAaaMode] = useState(() => localStorage.getItem('accessibilityMode') === 'aaa');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) setUser(currentUser);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.accessibility = isAaaMode ? 'aaa' : 'default';
    localStorage.setItem('accessibilityMode', isAaaMode ? 'aaa' : 'default');
  }, [isAaaMode]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
    window.location.reload(); // Recarga simple para limpiar el estado
  };

  return (
    <header className="site-header">
      <div className="container">
        <h1 className="site-title">Hardware Hub</h1>
        <nav className="site-nav" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/admin">Administrador</Link>
        </nav>
        <div className="auth-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user ? (
            <>
              <span className="user-message" style={{ color: 'var(--primary)' }}>
                Bienvenido, {user.name}
              </span>
              <button onClick={handleLogout} className="btn">Cerrar sesión</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => onOpenAuth?.()} className="btn auth-btn">Iniciar sesión / Registro</button>
            </>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => setIsAaaMode((prev) => !prev)}
            aria-pressed={isAaaMode}
            aria-label="Cambiar modo de accesibilidad Triple A"
          >
            {isAaaMode ? 'Triple A: Activado' : 'Triple A: Desactivado'}
          </button>
          <button type="button" className="btn" onClick={() => window.dispatchEvent(new CustomEvent('open-cart'))} aria-label="Abrir carrito">Carrito</button>
        </div>
      </div>
    </header>
  );
}