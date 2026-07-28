import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { asset } from '../lib/asset';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { t, lang, toggle } = useLang();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navRight = [
    { to: '/musique', label: t('nav.music') },
    { to: '/shop', label: t('nav.shop') },
  ];

  const linkClass = ({ isActive }) =>
    `glitch-hover hidden md:inline-block text-[12px] uppercase tracking-wider2 transition-colors ${
      isActive ? 'text-acid' : 'text-white/80 hover:text-white'
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'border-b border-acid/20 bg-void/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
          {/* Gauche — langue + presskit */}
          <div className="flex flex-1 items-center gap-6">
            <button
              type="button"
              onClick={toggle}
              aria-label={lang === 'en' ? 'Passer en français' : 'Switch to English'}
              className="group flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-wider2"
            >
              <span className={lang === 'en' ? 'text-acid' : 'text-white/40'}>EN</span>
              <span className="text-white/20">/</span>
              <span className={lang === 'fr' ? 'text-acid' : 'text-white/40'}>FR</span>
            </button>

            <NavLink to="/presskit" className={linkClass}>
              {t('nav.presskit')}
            </NavLink>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t('common.close') : 'Menu'}
              aria-expanded={menuOpen}
              className="text-white/90 transition-colors hover:text-acid md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Centre — logo, il vire au jaune au survol */}
          <Link to="/" aria-label="WINGZ" className="shrink-0">
            <img
              src={asset('/img/logo-wingz.png')}
              alt="WINGZ"
              className="logo-tox h-6 w-auto md:h-7"
            />
          </Link>

          {/* Droite */}
          <div className="flex flex-1 items-center justify-end gap-5 md:gap-7">
            {navRight.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t('nav.search')}
              aria-expanded={searchOpen}
              className="text-white/80 transition-colors hover:text-acid"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label={`${t('nav.cart')} (${count})`}
              className="relative text-white/80 transition-colors hover:text-acid"
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-acid px-1 text-[10px] font-semibold text-void">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-acid/20 bg-void/95 backdrop-blur-md"
            >
              <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-4 md:px-10">
                <span className="text-acid">&gt;</span>
                <input
                  type="search"
                  autoFocus
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menu plein écran (mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-void px-8 md:hidden"
          >
            {[
              { to: '/', label: t('nav.home') },
              ...navRight,
              { to: '/presskit', label: t('nav.presskit') },
            ].map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i + 0.08, duration: 0.4 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `h-display block py-3 text-5xl ${isActive ? 'text-acid' : 'text-white'}`
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
