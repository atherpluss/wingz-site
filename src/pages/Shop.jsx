import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories, products } from '../data/products';
import { useLang } from '../context/LangContext';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const { t, lang } = useLang();
  const [active, setActive] = useState('tout');
  const visible = active === 'tout' ? products : products.filter((p) => p.category === active);

  return (
    <div className="pt-28 md:pt-36">
      <section className="section-pad !pt-0">
        <div className="mx-auto max-w-[1600px]">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-display text-6xl md:text-8xl lg:text-9xl"
          >
            Shop
          </motion.h1>

          {/* Filtres */}
          <div className="mt-12 flex flex-wrap gap-3 border-b border-white/10 pb-6 md:mt-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={active === cat.id}
                className={`border px-5 py-2.5 text-[11px] uppercase tracking-wider2 transition-colors ${
                  active === cat.id
                    ? 'border-acid bg-acid text-void'
                    : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                }`}
              >
                {typeof cat.label === 'object' ? cat.label[lang] : cat.label}
              </button>
            ))}
          </div>

          {/* Grille — la clé force le rejeu de l'animation à chaque filtre. */}
          <motion.div
            key={active}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.07 }}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:grid-cols-3"
          >
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>

          {visible.length === 0 && (
            <p className="mt-16 text-sm text-white/40">{t('shop.empty')}</p>
          )}
        </div>
      </section>
    </div>
  );
}
