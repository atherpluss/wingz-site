// Tracklist officielle de PARTY LIFE (2026).
// Les morceaux ne sont plus hébergés sur le site : on pointe vers Spotify.
// Les IDs proviennent de l'album public 6ZgaYXleizj32UgzUOkbgE.
import { asset } from '../lib/asset';

export const album = {
  title: 'PARTY LIFE',
  year: 2026,
  artist: 'WINGZ',
  cover: asset('/img/cover-front.jpg'),
  coverBack: asset('/img/cover-back.jpg'),
  sticker: asset('/img/logo-partylife.png'),
  spotifyAlbumId: '6ZgaYXleizj32UgzUOkbgE',
  spotifyUrl: 'https://open.spotify.com/album/6ZgaYXleizj32UgzUOkbgE',
  credits: [
    { role: 'Direction créative', name: 'AETHERSTONE' },
    { role: 'Identité visuelle', name: 'AETHERSTONE' },
  ],
};

/**
 * `kind` distingue les deux natures de vidéo :
 *  - 'clip'        : vrai vidéoclip, mis en avant
 *  - 'visualizer'  : visualiseur (image animée), volontairement discret
 *
 * `youtube` = identifiant à 11 caractères.
 * TODO: compléter les IDs manquants — le lien de playlist fourni était tronqué
 * (`PLA7fRAAGr8ZUh`), seul ENTRY FEE a pu être confirmé.
 */
export const tracklist = [
  {
    id: 1,
    number: '01',
    title: 'ENTRY FEE',
    duration: '2:12',
    spotify: '7GNRe626ByZzZwefOqSmRn',
    youtube: 'jdu8bCsAccs',
    thumb: asset('/img/clips/entry-fee.jpg'),
    kind: 'visualizer',
    featured: true,
  },
  {
    id: 2,
    number: '02',
    title: 'SHE GOT WET',
    duration: '1:50',
    spotify: '5ObImPAwSnsi7oHTLdFoqV',
    youtube: 'SBqMxtYVRlM',
    thumb: asset('/img/clips/she-got-wet.jpg'),
    kind: 'visualizer',
  },
  {
    id: 3,
    number: '03',
    title: 'NIGHTLIFE',
    duration: '1:33',
    spotify: '6JXmsgkvpSKd8oky55vynH',
    youtube: 'H6aZNRx2HF8',
    thumb: asset('/img/clips/nightlife.jpg'),
    kind: 'visualizer',
  },
  {
    id: 4,
    number: '04',
    title: 'GUESTLIST',
    duration: '1:57',
    spotify: '0npWxv94fpdO3mclq7WKPF',
    youtube: 'a3lTiBtHHhY',
    thumb: asset('/img/clips/guestlist.jpg'),
    kind: 'visualizer',
  },
  {
    id: 5,
    number: '05',
    title: "LET'S NOT PRETEND",
    duration: '2:15',
    spotify: '7JHjq26CSBmLef21ee1TM7',
    youtube: '_YlzosKk6nM',
    thumb: asset('/img/clips/lets-not-pretend.jpg'),
    kind: 'clip',
    featured: true,
  },
  {
    id: 6,
    number: '06',
    title: 'TOXIC LOVE',
    duration: '1:49',
    spotify: '2AJTaplZpYokdAnNebSUdT',
    youtube: '2GLwboPXqN0',
    thumb: asset('/img/clips/toxic-love.jpg'),
    kind: 'visualizer',
  },
  {
    id: 7,
    number: '07',
    title: 'AIRPLANE MODE',
    duration: '2:07',
    spotify: '24yqRmGBHfFnXGH2hYAz88',
    youtube: null,
    kind: 'visualizer',
  },
  {
    id: 8,
    number: '08',
    title: 'AFTERHOURS',
    feat: 'BAXV',
    duration: '2:25',
    spotify: '1JYycnfH59asfOhvgzUw0q',
    youtube: '996Ce6cf-xY',
    thumb: asset('/img/clips/afterhours.jpg'),
    kind: 'visualizer',
  },
  {
    id: 9,
    number: '09',
    title: 'SHAT SHKEKSH',
    duration: '1:50',
    spotify: '3it4UDGAXu09qSdE15dema',
    youtube: null,
    kind: 'clip',
  },
];

/** Les deux vidéos mises en avant dans le panneau CLIPS. */
export const featuredVideos = tracklist.filter((t) => t.featured);

/** Tout ce qui a une vidéo disponible, pour la fenêtre « voir plus ». */
export const allVideos = tracklist.filter((t) => t.youtube || t.localVideo);
