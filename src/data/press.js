// Contenu du presskit — source : E-PRESS KIT officiel (Adobe Express, juillet 2026).
// Tout est fourni dans les deux langues : la page ne doit jamais mélanger
// l'anglais et le français.

export const contacts = [
  {
    id: 'press',
    label: { en: 'Press & interviews', fr: 'Presse & entrevues' },
    value: 'presse@wingz.com', // TODO: vraie adresse
    href: 'mailto:presse@wingz.com',
  },
  {
    id: 'booking',
    label: { en: 'Booking & dates', fr: 'Booking & dates' },
    value: 'booking@wingz.com', // TODO: vraie adresse
    href: 'mailto:booking@wingz.com',
  },
  {
    id: 'mgmt',
    label: { en: 'Management', fr: 'Management' },
    value: 'management@wingz.com', // TODO: vraie adresse
    href: 'mailto:management@wingz.com',
  },
];

export const bio = {
  short: {
    en: 'Wingz is a Tunisian rapper and songwriter leading the North African hip-hop scene — sharp storytelling, intricate wordplay and high-energy delivery.',
    fr: "Wingz est un rappeur et auteur tunisien à l'avant-garde de la scène hip-hop nord-africaine — récit tranchant, jeux de mots serrés, exécution à haute énergie.",
  },
  long: {
    en: 'Moving between intense street anthems and melodic, introspective tracks, Wingz has established himself as a dominant contemporary hip-hop voice. PARTY LIFE, his 9-track project released on Records El’Muttbukh, unleashes a gritty, dirty sound with wild lyrics and unpredictable flows — and opens a broader collaborative series with El’Muttbukh.',
    fr: "Entre hymnes de rue intenses et morceaux mélodiques plus introspectifs, Wingz s'est imposé comme une voix dominante du hip-hop contemporain. PARTY LIFE, projet de 9 titres paru chez Records El’Muttbukh, déchaîne un son brut et sale, aux textes sauvages et aux flows imprévisibles — et ouvre une série de collaborations avec El’Muttbukh.",
  },
};

export const albumFacts = [
  { key: { en: 'Title', fr: 'Titre' }, value: 'PARTY LIFE' },
  { key: { en: 'Artist', fr: 'Artiste' }, value: 'WINGZ' },
  { key: { en: 'Release', fr: 'Sortie' }, value: { en: 'July 27, 2026', fr: '27 juillet 2026' } },
  { key: { en: 'Label', fr: 'Label' }, value: 'Records El’Muttbukh' },
  { key: { en: 'Format', fr: 'Format' }, value: { en: '9 tracks — 18 min', fr: '9 titres — 18 min' } },
  {
    key: { en: 'Creative & art direction', fr: 'Direction créative & artistique' },
    value: 'AETHERSTONE',
  },
];

export const links = [
  { id: 1, label: 'Spotify', href: 'https://open.spotify.com/artist/6BNYhsSK9xr0u0qA8ufjk6' },
  { id: 2, label: 'Instagram', href: 'https://www.instagram.com/wingz.png/' },
  { id: 3, label: 'YouTube', href: 'https://www.youtube.com/@itsnotwingz' },
];

export const assets = [
  {
    id: 1,
    label: { en: 'Album cover — high resolution', fr: 'Pochette — haute définition' },
    detail: 'JPG · 3000 × 3000',
    href: '/img/cover-front.jpg',
    download: 'WINGZ-PARTY-LIFE-cover.jpg',
  },
  {
    id: 2,
    label: { en: 'Back cover', fr: 'Pochette verso' },
    detail: 'JPG · 3000 × 3000',
    href: '/img/cover-back.jpg',
    download: 'WINGZ-PARTY-LIFE-back.jpg',
  },
  {
    id: 3,
    label: { en: 'WINGZ logo — transparent', fr: 'Logo WINGZ — fond transparent' },
    detail: 'PNG',
    href: '/img/logo-wingz@2x.png',
    download: 'WINGZ-logo.png',
  },
  {
    id: 4,
    label: { en: 'Press photos', fr: 'Photos de presse' },
    detail: { en: 'JPG · 8 photos', fr: 'JPG · 8 photos' },
    href: '/img/photos/photo-1.jpg',
    download: 'WINGZ-press-photo.jpg',
  },
];
