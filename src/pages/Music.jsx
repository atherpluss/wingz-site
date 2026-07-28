import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Film, Play } from 'lucide-react';
import { album, tracklist } from '../data/tracklist';
import MatrixText from '../components/MatrixText';
import VideoModal from '../components/VideoModal';
import { useLang } from '../context/LangContext';

/**
 * Les morceaux ne sont pas hébergés sur le site : la lecture passe par le
 * lecteur officiel Spotify. Rien à protéger, rien à faire fuiter, et les
 * écoutes sont comptabilisées sur la plateforme.
 */
export default function Music() {
  const { t } = useLang();
  const [selected, setSelected] = useState(null);
  const [clip, setClip] = useState(null); // clip ouvert en surimpression
  const [hovered, setHovered] = useState(null); // ligne survolée, pour le brouillage

  // Sans sélection, on montre l'album complet ; sinon le titre choisi.
  const embedSrc = selected
    ? `https://open.spotify.com/embed/track/${selected.spotify}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/album/${album.spotifyAlbumId}?utm_source=generator&theme=0`;

  return (
    <div className="min-h-[100svh] px-6 pb-24 pt-28 md:px-12 md:pt-36 lg:px-20">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="label-tech mb-4">{t('music.listen')}</p>
          <h1 className="h-display text-6xl md:text-8xl">{t('music.title')}</h1>
        </motion.div>

        {/* Lecteur en haut de page */}
        <div className="mt-12 md:mt-16">
          <iframe
            key={embedSrc}
            src={embedSrc}
            title={selected ? selected.title : album.title}
            width="100%"
            height={selected ? 152 : 380}
            frameBorder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="w-full rounded-xl bg-coal"
          />

          <div className="mt-4 flex flex-wrap items-center gap-5">
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-[11px] uppercase tracking-wider2 text-white/50 transition-colors hover:text-acid"
              >
                ← {t('music.backToAlbum')}
              </button>
            )}
            <a
              href={album.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-acid transition-opacity hover:opacity-75"
            >
              {t('music.openSpotify')}
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Liste des titres — un clic charge le morceau dans le lecteur ci-dessus */}
        <ol className="mt-16 md:mt-20">
          {tracklist.map((track, i) => {
            const isCurrent = selected?.id === track.id;
            return (
              <motion.li
                key={track.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.04 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  onMouseEnter={() => setHovered(track.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group flex items-center gap-4 border-b border-white/10 py-4 transition-colors hover:border-acid/40 md:gap-6"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(track)}
                    aria-label={`${t('music.play')} ${track.title}`}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left md:gap-6"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-coal">
                      <img src="/img/cover-front-sm.jpg" alt="" className="h-full w-full object-cover" />
                      <span
                        className={`absolute inset-0 flex items-center justify-center bg-void/60 transition-opacity ${
                          isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Play size={14} className={isCurrent ? 'text-acid' : 'text-white'} />
                      </span>
                    </span>

                    <span className="w-6 shrink-0 text-xs text-white/30">{track.number}</span>

                    <span className="min-w-0 flex-1">
                      <MatrixText
                        as="span"
                        text={track.title}
                        start={hovered === track.id}
                        speed={18}
                        settleAfter={1.1}
                        className={`block truncate font-display text-lg uppercase tracking-wide md:text-xl ${
                          isCurrent ? 'text-acid' : 'text-white group-hover:text-acid'
                        }`}
                      />
                      {track.feat && (
                        <span className="mt-1 block text-xs text-white/40">ft. {track.feat}</span>
                      )}
                    </span>
                  </button>

                  {/*
                    Au survol de la ligne, la vignette réelle du clip se déplie
                    dans l'espace vide, avec l'invite « watch clip ». Un clic
                    ouvre le lecteur par-dessus la page.
                  */}
                  {track.youtube && (
                    <button
                      type="button"
                      onClick={() => setClip(track)}
                      aria-label={`${track.title} — clip`}
                      className="flex shrink-0 items-center gap-3 text-white/35 transition-colors hover:text-acid"
                    >
                      <span
                        className={`hidden overflow-hidden transition-all duration-500 ease-out md:block ${
                          hovered === track.id ? 'w-40 opacity-100' : 'w-0 opacity-0'
                        }`}
                      >
                        <span className="relative block aspect-video w-40 overflow-hidden border border-acid/40">
                          <img
                            src={track.thumb}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-void/45">
                            <Play size={16} className="text-acid" />
                          </span>
                        </span>
                      </span>

                      <span
                        className={`label-tech hidden !text-[9px] transition-opacity md:inline ${
                          hovered === track.id ? 'text-acid opacity-100' : 'opacity-0'
                        }`}
                      >
                        {t('music.watchClip')}
                      </span>

                      <Film size={16} />
                    </button>
                  )}

                  <span className="w-10 shrink-0 text-right text-xs text-white/30">
                    {track.duration}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <VideoModal track={clip} onClose={() => setClip(null)} />
    </div>
  );
}
