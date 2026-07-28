import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Truck, X } from 'lucide-react';
import { LIMITED } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import Typewriter from './Typewriter';

const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

/**
 * Fiche produit en surimpression : visuel, description, délai de livraison,
 * conditions d'expédition, et ajout au panier. On ne quitte jamais la page.
 * Quand le produit a plusieurs vues (recto / verso), des vignettes permettent
 * de basculer.
 */
export default function ProductModal() {
  const { viewed, closeProduct, addItem } = useCart();
  const { t, lang } = useLang();
  const [shot, setShot] = useState(0);

  // Repart sur la première vue à chaque ouverture.
  useEffect(() => {
    setShot(0);
  }, [viewed]);

  useEffect(() => {
    if (!viewed) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeProduct();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [viewed, closeProduct]);

  const shots = viewed?.gallery ?? (viewed ? [viewed.image] : []);

  return (
    <AnimatePresence>
      {viewed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={closeProduct}
          role="dialog"
          aria-modal="true"
          aria-label={pick(viewed.name, lang)}
          className="scanlines fixed inset-0 z-[78] flex items-center justify-center bg-void/95 p-5 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={closeProduct}
            aria-label={t('common.close')}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-void text-white transition-colors hover:border-acid hover:bg-acid hover:text-void md:right-9 md:top-9"
          >
            <X size={20} />
          </button>

          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[86vh] w-full max-w-4xl gap-8 overflow-y-auto border border-white/12 bg-coal p-6 md:grid-cols-2 md:gap-10 md:p-8"
          >
            <div>
              <div className="corners relative flex items-center justify-center border border-white/10 bg-white/[0.04]">
                <img
                  key={shots[shot]}
                  src={shots[shot]}
                  alt={pick(viewed.name, lang)}
                  className="max-h-[44vh] w-[88%] object-contain"
                />
              </div>

              {/* Recto / verso */}
              {shots.length > 1 && (
                <div className="mt-3 flex gap-3">
                  {shots.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setShot(i)}
                      aria-label={`${pick(viewed.name, lang)} ${i + 1}`}
                      className={`h-16 w-16 border p-1 transition-colors ${
                        i === shot ? 'border-acid' : 'border-white/15 hover:border-white/40'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <p className="label-tech mb-3 !text-acid">{t('shop.limited', LIMITED)}</p>

              <Typewriter
                as="h2"
                text={pick(viewed.name, lang).toUpperCase()}
                speed={30}
                className="h-display text-3xl md:text-4xl"
              />

              <p className="mt-4 font-display text-2xl text-acid">
                {viewed.price} {viewed.currency}
              </p>

              <p className="mt-6 text-sm leading-relaxed text-white/70">
                {pick(viewed.details, lang)}
              </p>

              <p className="mt-6 flex items-center gap-2 text-sm text-white/85">
                <Truck size={15} className="shrink-0 text-acid" />
                {t('shop.delivery', viewed.delivery)}
              </p>

              <p className="mt-3 border-t border-white/12 pt-4 text-xs leading-relaxed text-white/45">
                {t('shop.shippingNote')}
              </p>

              <button
                type="button"
                onClick={() => {
                  addItem(viewed);
                  closeProduct();
                }}
                className="btn-tox mt-7 w-full"
              >
                <span>{t('shop.addToCart')}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
