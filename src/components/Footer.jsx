import { useState } from 'react';

export default function Footer() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      setSuccessMsg('Por favor complete el asunto y el mensaje.');
      return;
    }
    const key = 'contactMessages';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...formData, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    
    setSuccessMsg('Mensaje guardado correctamente.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <footer className="site-footer">
      <hr />
      <div className="container">
        <div className="footer-columns">
          <div className="footer-main-info">
            <p className="footer-title">Síguenos y contáctanos</p>
            <nav aria-label="Redes sociales" className="social-links">
              <a href="https://wa.me/123456789" target="_blank" rel="noreferrer">WhatsApp</a>
              <span aria-hidden="true">|</span>
              <a href="https://instagram.com/tu_usuario" target="_blank" rel="noreferrer">Instagram</a>
              <span aria-hidden="true">|</span>
              <a href="https://facebook.com/tu_pagina" target="_blank" rel="noreferrer">Facebook</a>
            </nav>

            <p>Teléfono: <a href="tel:+123456789">+1 234 567 89</a></p>
            <p>Dirección: Calle Falsa 123, Ciudad Ejemplo</p>
            <p>Correo: <a href="mailto:info@hardwarehub.example">info@hardwarehub.example</a></p>
          </div>

          <div className="footer-academic-info">
            <p>Nombre Alumno: Luciano Castillo</p>
            <p>Nombre Profesor: Victor Vasquez</p>
            <p>Asignatura: Programación Front End</p>
            <p>Sección: IEI-N3-P2-C2</p>
          </div>
        </div>

        
      </div>
    </footer>
  );
}