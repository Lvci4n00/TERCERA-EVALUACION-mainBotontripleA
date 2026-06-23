import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const { name, email, password, passwordConfirm } = Object.fromEntries(data);

    if (password !== passwordConfirm) return setMsg({ text: 'Las contraseñas no coinciden.', type: 'danger' });
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return setMsg({ text: 'El correo ya existe.', type: 'danger' });

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    setMsg({ text: 'Cuenta creada correctamente. Ya puedes iniciar sesión.', type: 'primary' });
    e.target.reset();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const { email, password } = Object.fromEntries(data);

    // Admin credentials (hardcoded as requested)
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ name: 'admin', email: 'admin123' }));
      navigate('/admin', { replace: true });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) return setMsg({ text: 'Credenciales incorrectas.', type: 'danger' });

    localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
    window.location.href = '/'; // Redirige y refresca para actualizar el Navbar
  };

  return (
    <div className="footer-auth-forms" style={{ marginTop: '2rem' }}>
      {msg.text && <p style={{ width: '100%', textAlign: 'center', color: `var(--${msg.type})` }}>{msg.text}</p>}
      
      <section className="footer-form">
        <h3>Iniciar sesión</h3>
        <form onSubmit={handleLogin}>
          <label>Correo</label><input name="email" type="email" required />
          <label>Contraseña</label><input name="password" type="password" required />
          <button type="submit" className="btn">Entrar</button>
        </form>
      </section>

      <section className="footer-form">
        <h3>Registrarse</h3>
        <form onSubmit={handleRegister}>
          <label>Nombre</label><input name="name" type="text" required />
          <label>Correo</label><input name="email" type="email" required />
          <label>Contraseña</label><input name="password" type="password" required />
          <label>Confirmar contraseña</label><input name="passwordConfirm" type="password" required />
          <button type="submit" className="btn">Crear cuenta</button>
        </form>
      </section>
    </div>
  );
}