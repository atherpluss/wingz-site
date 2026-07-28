import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';

const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

export default function CartDrawer() {
  const { items, total, isOpen, closeCart, removeItem, setQty, openCheckout } = useCart();
  const { t, lang } = useLang();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-void/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t('shop.cart')}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-white/10 bg-coal"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-lg uppercase tracking-wider2">{t('shop.cart')}</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label={t('common.close')}
                className="text-white/70 transition-colors hover:text-acid"
              >
                <X size={20} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-6">
                <p className="text-sm text-white/40">{t('shop.cartEmpty')}</p>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 border-b border-white/10 py-5">
                    <img
                      src={item.image}
                      alt={pick(item.name, lang)}
                      className="h-20 w-20 shrink-0 bg-neutral-200 object-cover"
                    />

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-sm uppercase leading-tight">{pick(item.name, lang)}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`${t('shop.remove')} ${pick(item.name, lang)}`}
                          className="shrink-0 text-white/40 transition-colors hover:text-acid"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-white/20">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label="-"
                            className="px-2 py-1 text-white/70 transition-colors hover:text-acid"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="min-w-6 text-center text-xs">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label="+"
                            className="px-2 py-1 text-white/70 transition-colors hover:text-acid"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <p className="text-sm text-white/70">{item.price * item.qty} {item.currency}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <footer className="border-t border-white/10 px-6 py-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="label-tech">{t('shop.total')}</span>
                <span className="font-display text-2xl">{total}</span>
              </div>
              <button
                type="button"
                onClick={openCheckout}
                disabled={items.length === 0}
                className="w-full bg-acid py-4 text-[11px] uppercase tracking-wider2 text-void transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {t('shop.checkout')}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
