import { motion } from 'framer-motion';
import { LIMITED } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';

const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

/**
 * Carte produit. Le clic ouvre la fiche détaillée ; le bouton ajoute
 * directement au panier sans passer par la fiche.
 *
 * Les visuels sont des PNG transparents posés sur un panneau sombre discret :
 * un aplat blanc découperait un rectangle en plein milieu de la page noire.
 */
export default function ProductCard({ product }) {
  const { addItem, viewProduct } = useCart();
  const { t, lang } = useLang();
  const name = pick(product.name, lang);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="group"
    >
      <button
        type="button"
        onClick={() => viewProduct(product)}
        aria-label={name}
        className="block w-full text-left"
      >
        <div className="corners relative flex aspect-square items-center justify-center overflow-hidden border border-white/10 bg-white/[0.04] transition-colors duration-500 group-hover:border-acid/40 group-hover:bg-white/[0.07]">
          <img
            src={product.image}
            alt={name}
            loading="lazy"
            className="h-[86%] w-[86%] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Discret au repos, il ne se lit qu'au survol : répété six fois en
              pleine grille, le bandeau écrasait les visuels. */}
          <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-wider2 text-white/25 transition-colors duration-500 group-hover:text-acid">
            {`/ ${LIMITED}`}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-base uppercase leading-tight tracking-wide transition-colors group-hover:text-acid">
            {name}
          </h3>
          <p className="shrink-0 font-body text-sm text-white/70">
            {product.price} {product.currency}
          </p>
        </div>
      </button>

      <button type="button" onClick={() => addItem(product)} className="btn-tox mt-4 w-full">
        <span>{t('shop.addToCart')}</span>
      </button>
    </motion.article>
  );
}
