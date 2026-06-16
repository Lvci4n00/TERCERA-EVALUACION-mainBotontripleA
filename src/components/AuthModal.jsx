import { useEffect, useRef } from 'react';

export default function AuthModal({ open, onClose }) {
  const nameRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => { if (open) setTimeout(() => nameRef.current?.focus(), 0); }, [open]);

  if (!open) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const { name, email, password, passwordConfirm } = Object.fromEntries(data);
    if (password !== passwordConfirm) return alert('Las contraseñas no coinciden.');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return alert('El correo ya existe.');
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Cuenta creada correctamente. Ya puedes iniciar sesión.');
    e.target.reset();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const { email, password } = Object.fromEntries(data);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return alert('Credenciales incorrectas.');
    localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" role="document">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar diálogo">×</button>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <section className="footer-form" style={{ flex: '1 1 280px' }}>
            <h3>Iniciar sesión</h3>
            <form onSubmit={handleLogin}>
              <label>Correo</label>
              <input name="email" type="email" required />
              <label>Contraseña</label>
              <input name="password" type="password" required />
              <button type="submit" className="btn">Entrar</button>
            </form>
          </section>

          <section className="footer-form" style={{ flex: '1 1 280px' }}>
            <h3>Registrarse</h3>
            <form onSubmit={handleRegister}>
              <label>Nombre</label>
              <input ref={nameRef} name="name" type="text" required />
              <label>Correo</label>
              <input name="email" type="email" required />
              <label>Contraseña</label>
              <input name="password" type="password" required />
              <label>Confirmar contraseña</label>
              <input name="passwordConfirm" type="password" required />
              <button type="submit" className="btn">Crear cuenta</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
