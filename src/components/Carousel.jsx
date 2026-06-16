import { useState, useEffect } from 'react';

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const slides = [
    '/images/primera-imagen-carrusel.png',
    '/images/segunda-imagen-carrusel.png',
    '/images/tercera-imagen-carrusel.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero-carousel" aria-roledescription="carousel" style={{ overflow: 'hidden' }}>
      <div 
        className="carousel-track" 
        style={{ 
          display: 'flex', 
          transform: `translateX(-${index * 100}%)`, 
          transition: 'transform 400ms ease',
          width: '100%'
        }}
      >
        {slides.map((src, i) => (
          <div key={i} className="carousel-slide" style={{ minWidth: '100%', flexShrink: 0 }}>
            <img src={src} alt={`Slide ${i + 1}`} loading="lazy" style={{ width: '100%', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
    </div>
  );
}