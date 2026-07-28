import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import Home from './pages/Home';
import Music from './pages/Music';
import Shop from './pages/Shop';
import Presskit from './pages/Presskit';
import { CartProvider } from './context/CartContext';
import { LangProvider } from './context/LangContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  // L'accueil défile horizontalement : un pied de page classique s'y
  // intercalerait mal. Il reste sur les pages verticales.
  const showFooter = pathname !== '/';

  return (
    <LangProvider>
    <CartProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/musique" element={<Music />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/presskit" element={<Presskit />} />
          {/* Ancienne URL conservée pour ne pas casser les liens déjà partagés. */}
          <Route path="/presse" element={<Presskit />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
    </CartProvider>
    </LangProvider>
  );
}
