import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import Admin from './pages/Admin';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Ofertas from './pages/Ofertas';
import Auth from './pages/Auth';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setCartOpen(true);
    const onToggle = () => setCartOpen(prev => prev);
    window.addEventListener('open-cart', onOpen);
    window.addEventListener('cart-updated', onToggle);
    return () => {
      window.removeEventListener('open-cart', onOpen);
      window.removeEventListener('cart-updated', onToggle);
    };
  }, []);

  return (
    <>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main id="main" className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <ContactModal />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      <Footer />
    </>
  );
}

export default App;