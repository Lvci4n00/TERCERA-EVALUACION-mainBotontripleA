import { useEffect, useRef, useState } from 'react';

export default function AccessibilityButton(){
  const [open, setOpen] = useState(false);
  const [aaa, setAaa] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [colorMode, setColorMode] = useState('');
  const firstControl = useRef(null);

  useEffect(() => {
    const savedAaa = localStorage.getItem('accessibility_aaa') === 'true';
    const savedFont = localStorage.getItem('accessibility_font') || 'normal';
    const savedColor = localStorage.getItem('accessibility_color') || '';
    setAaa(savedAaa);
    setFontSize(savedFont);
    setColorMode(savedColor);
    applySettings(savedAaa, savedFont, savedColor);
  }, []);

  useEffect(() => {
    function onKey(e){
      if(e.key === 'Escape') setOpen(false);
    }
    if(open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if(open && firstControl.current){
      firstControl.current.focus();
    }
  }, [open]);

  function applySettings(aaaVal, fontVal, colorVal){
    const html = document.documentElement;
    if(aaaVal) html.setAttribute('data-accessibility', 'aaa');
    else html.removeAttribute('data-accessibility');

    if(fontVal) html.setAttribute('data-font-size', fontVal);
    else html.removeAttribute('data-font-size');

    if(colorVal) html.setAttribute('data-color-mode', colorVal);
    else html.removeAttribute('data-color-mode');
  }

  function toggleAaa(){
    const next = !aaa;
    setAaa(next);
    localStorage.setItem('accessibility_aaa', next ? 'true' : 'false');
    applySettings(next, fontSize, colorMode);
  }

  function onFontChange(e){
    const v = e.target.value;
    setFontSize(v);
    localStorage.setItem('accessibility_font', v);
    applySettings(aaa, v, colorMode);
  }

  function onColorChange(e){
    const v = e.target.value;
    setColorMode(v);
    localStorage.setItem('accessibility_color', v);
    applySettings(aaa, fontSize, v);
  }

  return (
    <div className="accessibility-fab-wrap" aria-live="polite">
      <button
        className="accessibility-fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="accessibility-panel"
        onClick={() => setOpen(o => !o)}
      >
        Accesibilidad
      </button>

      {open && (
        <div id="accessibility-panel" className="accessibility-panel-floating" role="dialog" aria-label="Opciones de accesibilidad">
          <label>
            <input ref={firstControl} type="checkbox" checked={aaa} onChange={toggleAaa} /> Activar modo AAA
          </label>

          <label>
            Tamaño letra
            <select value={fontSize} onChange={onFontChange}>
              <option value="normal">Normal</option>
              <option value="grande">Grande</option>
              <option value="muy-grande">Muy grande</option>
            </select>
          </label>

          <label>
            Colores
            <select value={colorMode} onChange={onColorChange}>
              <option value="">Por defecto</option>
              <option value="aaa-dark">Contraste oscuro</option>
              <option value="aaa-light">Contraste claro</option>
              <option value="aaa-blue">Contraste azul</option>
            </select>
          </label>

          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
            <button className="btn" onClick={() => { setOpen(false); }} aria-label="Cerrar panel">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
