import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Navbar({ onOpenAuth }) {
  const [user, setUser] = useState(null);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState(() => localStorage.getItem('fontSizeMode') || 'normal');
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('colorMode') || 'aaa-dark');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) setUser(currentUser);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSizeMode;
    localStorage.setItem('fontSizeMode', fontSizeMode);
  }, [fontSizeMode]);

  useEffect(() => {
    document.documentElement.dataset.colorMode = colorMode;
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
    globalThis.location.reload();
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
            <button type="button" onClick={() => onOpenAuth?.()} className="btn auth-btn">Iniciar sesión / Registro</button>
          )}
          <div className="accessibility-wrap">
            <button
              type="button"
              className="btn"
              onClick={() => setShowAccessibilityPanel((prev) => !prev)}
              aria-expanded={showAccessibilityPanel}
              aria-controls="accessibility-panel"
              aria-label="Abrir opciones de accesibilidad"
            >
              Accesibilidad
            </button>

            {showAccessibilityPanel && (
              <section id="accessibility-panel" className="accessibility-panel" aria-label="Opciones de accesibilidad">
                <label htmlFor="font-size-select">Tamaño letra</label>
                <select
                  id="font-size-select"
                  value={fontSizeMode}
                  onChange={(e) => setFontSizeMode(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="grande">Grande</option>
                  <option value="muy-grande">Muy grande</option>
                </select>

                <label htmlFor="color-mode-select">Colores</label>
                <select
                  id="color-mode-select"
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                >
                  <option value="aaa-dark">Triple A Oscuro</option>
                  <option value="aaa-light">Triple A Claro</option>
                  <option value="aaa-blue">Triple A Azul</option>
                </select>
              </section>
            )}
          </div>
          <button type="button" className="btn" onClick={() => globalThis.dispatchEvent(new CustomEvent('open-cart'))} aria-label="Abrir carrito">Carrito</button>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  onOpenAuth: PropTypes.func,
};