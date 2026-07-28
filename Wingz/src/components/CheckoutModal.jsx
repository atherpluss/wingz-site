import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import Typewriter from './Typewriter';
import { FORMSPREE_URL } from '../lib/formspree';

const pick = (v, lang) => (typeof v === 'object' && v !== null ? v[lang] : v);

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', address: '' };

/**
 * Fenêtre de commande : le client laisse ses coordonnées, le récapitulatif
 * complet du panier part par courriel, et on lui annonce qu'on le recontacte
 * pour finaliser. Aucun paiement n'est encaissé ici.
 */
export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout, items, total, clear } = useCart();
  const { t, lang } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  useEffect(() => {
    if (!checkoutOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeCheckout();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [checkoutOpen, closeCheckout]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    // Récapitulatif lisible dans le courriel, pas seulement des IDs.
    const lines = items.map(
      (i) => `${i.qty} × ${pick(i.name, lang)} — ${i.price * i.qty} ${i.currency}`
    );

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `NEW ORDER — ${form.firstName} ${form.lastName}`,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          address: form.address,
          order: lines.join('\n'),
          total: `${total}`,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      clear();
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const field = (key, label, type = 'text') => (
    <label className="block">
      <span className="label-tech mb-1.5 block !text-[10px]">{label}</span>
      <input
        type={type}
        required
        value={form[key]}
        onChange={set(key)}
        className="w-full border border-white/20 bg-void px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-acid"
      />
    </label>
  );

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={closeCheckout}
          role="dialog"
          aria-modal="true"
          aria-label={t('shop.orderTitle')}
          className="scanlines fixed inset-0 z-[82] flex items-center justify-center bg-void/96 p-5 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={closeCheckout}
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
                  text={t('shop.orderOk')}
                  speed={22}
                  className="text-sm leading-relaxed text-white/80"
                />
              </div>
            ) : (
              <>
                <Typewriter
                  as="h2"
                  text={t('shop.orderTitle').toUpperCase()}
                  speed={30}
                  className="h-display text-3xl"
                />
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {t('shop.orderIntro')}
                </p>

                {/* Récapitulatif */}
                <ul className="mt-6 border-y border-white/12 py-4">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-4 py-1.5 text-sm">
                      <span className="min-w-0 text-white/75">
                        {i.qty} × {pick(i.name, lang)}
                      </span>
                      <span className="shrink-0 text-white/55">
                        {i.price * i.qty} {i.currency}
                      </span>
                    </li>
                  ))}
                  <li className="mt-3 flex justify-between border-t border-white/12 pt-3">
                    <span className="label-tech">{t('shop.total')}</span>
                    <span className="font-display text-xl text-acid">{total}</span>
                  </li>
                </ul>

                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field('firstName', t('shop.firstName'))}
                    {field('lastName', t('shop.lastName'))}
                  </div>
                  {field('email', t('press.yourEmail'), 'email')}
                  {field('phone', t('shop.phone'), 'tel')}
                  {field('address', t('shop.address'))}

                  <p className="text-xs leading-relaxed text-white/40">
                    {t('shop.shippingNote')}
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'sending' || items.length === 0}
                    className="btn-tox w-full disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>
                      {status === 'sending' ? t('shop.sending') : t('shop.placeOrder')}
                    </span>
                  </button>

                  {status === 'error' && (
                    <p className="text-xs text-red-400">{t('shop.orderError')}</p>
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
