import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { FORMSPREE_URL } from '../lib/formspree';
import Typewriter from './Typewriter';

const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

const EMPTY = { name: '', email: '', message: '' };

/**
 * Fenêtre de contact du presskit : plutôt qu'un simple lien mailto (qui exige
 * un client mail configuré), le message part directement par Formspree vers
 * la boîte de l'artiste.
 */
export default function ContactModal({ contact, onClose }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  const open = Boolean(contact);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setStatus('idle');
    }
  }, [open, contact]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Presskit — ${pick(contact.label, 'en')} — ${form.name}`,
          category: pick(contact.label, 'en'),
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={pick(contact.label, lang)}
          className="scanlines fixed inset-0 z-[82] flex items-center justify-center bg-void/96 p-5 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={onClose}
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
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto border border-white/12 bg-coal p-6 md:p-8"
          >
            {status === 'ok' ? (
              <div className="py-10 text-center">
                <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-acid text-acid">
                  <Check size={26} />
                </span>
                <Typewriter
                  as="p"
                  text={t('press.contactOk')}
                  speed={22}
                  className="text-sm leading-relaxed text-white/80"
                />
              </div>
            ) : (
              <>
                <p className="label-tech mb-2">{pick(contact.label, lang)}</p>
                <Typewriter
                  as="h2"
                  text={t('press.write').toUpperCase()}
                  speed={30}
                  className="h-display text-3xl"
                />

                <form onSubmit={submit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="label-tech mb-1.5 block !text-[10px]">
                      {t('press.yourName')}
                    </span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      className="w-full border border-white/20 bg-void px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-acid"
                    />
                  </label>
                  <label className="block">
                    <span className="label-tech mb-1.5 block !text-[10px]">
                      {t('press.yourEmail')}
                    </span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      className="w-full border border-white/20 bg-void px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-acid"
                    />
                  </label>
                  <label className="block">
                    <span className="label-tech mb-1.5 block !text-[10px]">
                      {t('press.yourMessage')}
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      className="w-full resize-none border border-white/20 bg-void px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-acid"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-tox w-full disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>{status === 'sending' ? t('shop.sending') : t('press.send')}</span>
                  </button>

                  {status === 'error' && (
                    <p className="text-xs text-red-400">{t('press.contactError')}</p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
