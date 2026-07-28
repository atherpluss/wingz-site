import { useState } from 'react';
import { Instagram, Music2, Youtube } from 'lucide-react';
import { useLang } from '../context/LangContext';

// Boîte de réception de l'infolettre : les inscriptions arrivent par courriel
// via Formspree.
const FORMSPREE_URL = 'https://formspree.io/f/xkodybog';

const SOCIALS = [
  { label: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/wingz.png/' },
  {
    label: 'Spotify',
    icon: Music2,
    url: 'https://open.spotify.com/artist/6BNYhsSK9xr0u0qA8ufjk6',
  },
  { label: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@itsnotwingz' },
];

export default function Footer() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: 'Newsletter — new subscriber' }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };
  const LINKS = [
    { label: t('footer.help'), url: '#' },
    { label: t('footer.privacy'), url: '#' },
    { label: t('footer.terms'), url: '#' },
    { label: t('footer.cookies'), url: '#' },
  ];
  return (
    <footer className="border-t border-white/10 bg-void px-6 pb-10 pt-20 md:px-12 md:pt-28 lg:px-20">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Logo */}
          <div>
            <img src="/img/logo-wingz.png" alt="WINGZ" className="h-10 w-auto" />
            <p className="label-tech mt-4">PARTY LIFE — 2026</p>
          </div>

          {/* Liens */}
          <nav aria-label="Liens utiles">
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.url}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Infolettre — visuel, non branché. TODO: connecter au service d'envoi. */}
          <div>
            <p className="label-tech mb-4">{t('footer.newsletter')}</p>
            {status === 'ok' ? (
              <p className="border-b border-acid/50 pb-2 text-sm text-acid">
                {t('footer.subscribed')}
              </p>
            ) : (
              <form
                onSubmit={subscribe}
                className="flex items-center gap-3 border-b border-white/20 pb-2 transition-colors focus-within:border-acid"
              >
                <label htmlFor="newsletter" className="sr-only">
                  {t('press.yourEmail')}
                </label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('press.yourEmail')}
                  className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="shrink-0 text-[11px] uppercase tracking-wider2 text-acid transition-opacity hover:opacity-70 disabled:opacity-40"
                >
                  {status === 'sending' ? '…' : 'OK'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-2 text-xs text-red-400">{t('footer.subscribeError')}</p>
            )}

            <div className="mt-8 flex items-center gap-5">
              {SOCIALS.map(({ label, icon: Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target={url === '#' ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="text-white/50 transition-colors hover:text-acid"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-3">
          <p className="text-[11px] tracking-wider2 text-white/30">
            {t('footer.rights')}
          </p>
          <p className="text-[11px] tracking-wider2 text-white/30">
            {t('footer.madeBy')}{' '}
            <a
              href="https://www.instagram.com/nadhem_hsini/"
              target="_blank"
              rel="noreferrer"
              className="text-white/55 transition-colors hover:text-acid"
            >
              AETHERSTONE
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
