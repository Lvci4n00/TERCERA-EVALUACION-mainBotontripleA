import { useState, useRef, useEffect } from 'react';

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const buttonRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    } else {
      buttonRef.current?.focus();
    }
  }, [open]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <>
      <button
        ref={buttonRef}
        className="contact-button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Contactar
      </button>

      {open && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="modal-content" role="document">
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Cerrar diálogo">×</button>
            <h3 id="contact-modal-title">Envíanos un mensaje</h3>

            <form className="contact-form" onSubmit={handleSubmit} aria-labelledby="contact-modal-title">
              <label htmlFor="cm-name">Nombre</label>
              <input ref={firstInputRef} type="text" id="cm-name" name="name" value={formData.name} onChange={handleChange} />

              <label htmlFor="cm-email">Correo electrónico</label>
              <input type="email" id="cm-email" name="email" value={formData.email} onChange={handleChange} />

              <label htmlFor="cm-subject">Asunto</label>
              <input type="text" id="cm-subject" name="subject" value={formData.subject} onChange={handleChange} required />

              <label htmlFor="cm-message">Mensaje</label>
              <textarea id="cm-message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>

              <button type="submit" className="btn">Enviar mensaje</button>
              {successMsg && <p className="contact-success" style={{ color: 'var(--primary)' }}>{successMsg}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
