// Catalogue officiel. Prix en dinars tunisiens, sauf le vinyle en dollars.
// Toute la boutique est en série limitée à 50 exemplaires.
// Livraison internationale ; frais d'expédition communiqués à l'achat ;
// toute vente est finale.
import { asset } from '../lib/asset';

export const LIMITED = 50;

export const categories = [
  { id: 'tout', label: { en: 'All', fr: 'Tout' } },
  { id: 'tees', label: { en: 'T-shirts', fr: 'T-shirts' } },
  { id: 'musique', label: { en: 'Music', fr: 'Musique' } },
  { id: 'combos', label: { en: 'Bundles', fr: 'Combos' } },
];

const TEE_TEXT = {
  en: 'White tee, 100% cotton. DTF print and serigraphy.',
  fr: 'T-shirt blanc, 100 % coton. Impression DTF et sérigraphie.',
};

export const products = [
  {
    id: 1,
    // Un seul t-shirt imprimé des deux côtés : artwork devant, NIGHTLIFE au dos.
    name: { en: 'PARTY LIFE Tee', fr: 'T-shirt PARTY LIFE' },
    category: 'tees',
    price: 50,
    currency: 'TND',
    image: asset('/img/shop/tee-front.png'),
    gallery: [asset('/img/shop/tee-front.png'), asset('/img/shop/tee-back.png')],
    featured: true,
    delivery: 10,
    details: {
      en: `${TEE_TEXT.en} Printed front and back — PARTY LIFE artwork on the chest, NIGHTLIFE across the back.`,
      fr: `${TEE_TEXT.fr} Imprimé recto et verso — l'artwork PARTY LIFE sur la poitrine, NIGHTLIFE dans le dos.`,
    },
  },
  {
    id: 2,
    name: { en: 'PARTY LIFE Tee — Sticker', fr: 'T-shirt PARTY LIFE — Sticker' },
    category: 'tees',
    price: 40,
    currency: 'TND',
    image: asset('/img/shop/tee-sticker.png'),
    featured: true,
    delivery: 10,
    details: {
      en: `${TEE_TEXT.en} The yellow PARTY LIFE hazard sticker on the chest.`,
      fr: `${TEE_TEXT.fr} Le sticker jaune PARTY LIFE sur la poitrine.`,
    },
  },
  {
    id: 3,
    name: { en: 'PARTY LIFE — CD', fr: 'PARTY LIFE — CD' },
    category: 'musique',
    price: 25,
    currency: 'TND',
    image: asset('/img/shop/cd.png'),
    featured: true,
    delivery: 10,
    details: {
      en: 'The 9-track album in a jewel case, shrink-wrapped, with the AETHERSTONE seal.',
      fr: "L'album 9 titres en boîtier cristal, sous cellophane, avec le sceau AETHERSTONE.",
    },
  },
  {
    id: 4,
    name: { en: 'PARTY LIFE — Vinyl', fr: 'PARTY LIFE — Vinyle' },
    category: 'musique',
    price: 90,
    currency: '$',
    image: asset('/img/shop/vinyl.png'),
    featured: true,
    delivery: 20,
    details: {
      en: 'The album on vinyl, full-sleeve PARTY LIFE artwork, shrink-wrapped.',
      fr: "L'album en vinyle, pochette artwork PARTY LIFE, sous cellophane.",
    },
  },
  {
    id: 5,
    // TODO: prix des combos à confirmer — remise de 15 TND sur la somme des pièces.
    name: { en: 'Bundle — Tee + CD', fr: 'Combo — T-shirt + CD' },
    category: 'combos',
    price: 65,
    currency: 'TND',
    image: asset('/img/shop/combo-tee.png'),
    delivery: 10,
    details: {
      en: 'The front-and-back PARTY LIFE tee and the CD, together.',
      fr: 'Le t-shirt PARTY LIFE recto-verso et le CD, ensemble.',
    },
  },
  {
    id: 6,
    name: { en: 'Bundle — Sticker Tee + CD', fr: 'Combo — T-shirt Sticker + CD' },
    category: 'combos',
    price: 55,
    currency: 'TND',
    image: asset('/img/shop/combo-sticker.png'),
    delivery: 10,
    details: {
      en: 'The sticker tee and the CD, together.',
      fr: 'Le t-shirt sticker et le CD, ensemble.',
    },
  },
];
