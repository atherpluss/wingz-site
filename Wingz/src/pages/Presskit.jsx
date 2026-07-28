import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { albumFacts, assets, bio, contacts, links } from '../data/press';
import { pressPhotos } from '../data/press-photos';
import { useLang } from '../context/LangContext';
import ContactModal from '../components/ContactModal';

/** Résout un champ bilingue ({en, fr}) ou une chaîne simple. */
const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

export default function Presskit() {
  const { t, lang } = useLang();
  const [activeContact, setActiveContact] = useState(null);

  return (
    <div className="min-h-[100svh] px-6 pb-24 pt-28 md:px-12 md:pt-36 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="label-tech mb-4">{t('press.media')}</p>
          <h1 className="h-display text-6xl md:text-8xl">{t('press.title')}</h1>
        </motion.div>

        {/* Bio d'abord : c'est ce qu'un client ou un média lit en premier. */}
        <motion.section {...fadeUp} className="mt-16 md:mt-20" aria-labelledby="pk-about">
          <h2 id="pk-about" className="label-tech mb-6">
            {t('press.about')}
          </h2>
          <p className="font-serif text-xl leading-relaxed text-white/85 md:text-2xl md:leading-relaxed">
            {pick(bio.short, lang)}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/55">
            {pick(bio.long, lang)}
          </p>

          <div className="mt-7 flex flex-wrap gap-5">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider2 text-acid transition-opacity hover:opacity-70"
              >
                {l.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </motion.section>

        {/* Photos de presse */}
        <motion.section {...fadeUp} className="mt-20" aria-labelledby="pk-photos">
          <h2 id="pk-photos" className="label-tech mb-6">
            {t('home.photos')}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {pressPhotos.map((p) => (
              <a
                key={p.id}
                href={p.src}
                download={`WINGZ-press-${p.id}.jpg`}
                className="group relative block overflow-hidden bg-coal"
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-void/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Download size={18} className="text-acid" />
                </span>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Fiche album */}
        <motion.section {...fadeUp} className="mt-20" aria-labelledby="pk-facts">
          <h2 id="pk-facts" className="label-tech mb-6">
            {t('press.albumSheet')}
          </h2>
          <dl className="grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2">
            {albumFacts.map((f) => (
              <div key={pick(f.key, 'en')} className="flex justify-between gap-4 bg-void px-6 py-4">
                <dt className="label-tech">{pick(f.key, lang)}</dt>
                <dd className="text-right text-sm text-white/85">{pick(f.value, lang)}</dd>
              </div>
            ))}
          </dl>
        </motion.section>

        {/* Contacts */}
        <motion.section {...fadeUp} className="mt-20" aria-labelledby="pk-contacts">
          <h2 id="pk-contacts" className="label-tech mb-6">
            {t('press.contacts')}
          </h2>
          <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-3">
            {contacts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveContact(c)}
                className="group flex flex-col gap-2 bg-void p-6 text-left transition-colors hover:bg-coal"
              >
                <span className="label-tech">{pick(c.label, lang)}</span>
                <span className="flex items-center gap-2 text-sm text-white/85 transition-colors group-hover:text-acid">
                  <Mail size={14} />
                  {c.value}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Ressources téléchargeables */}
        <motion.section {...fadeUp} className="mt-20" aria-labelledby="pk-assets">
          <h2 id="pk-assets" className="label-tech mb-6">
            {t('press.resources')}
          </h2>
          <ul className="border-t border-white/12">
            {assets.map((a) => (
              <li key={a.id}>
                <a
                  href={a.href}
                  download={a.download}
                  className="group flex items-center justify-between gap-6 border-b border-white/12 py-5 transition-colors hover:border-white/30"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-base uppercase tracking-wide transition-colors group-hover:text-acid">
                      {pick(a.label, lang)}
                    </span>
                    <span className="label-tech mt-1 block">{pick(a.detail, lang)}</span>
                  </span>
                  <Download
                    size={16}
                    className="shrink-0 text-white/35 transition-colors group-hover:text-acid"
                  />
                </a>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
      <ContactModal contact={activeContact} onClose={() => setActiveContact(null)} />
    </div>
  );
}
