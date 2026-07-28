import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Le site est en anglais par défaut ; le français est un basculement.
 * La préférence est retenue d'une visite à l'autre.
 */
const LangContext = createContext(null);

const STRINGS = {
  en: {
    // Navigation
    'nav.music': 'Music',
    'nav.shop': 'Shop',
    'nav.presskit': 'Presskit',
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.cart': 'Cart',
    'nav.searchPlaceholder': 'Search a track, a product…',

    // Repères de défilement
    'stage.scroll': 'Scroll',
    'stage.intro': 'Intro',
    'stage.album': 'Album',
    'stage.photos': 'Photos',
    'stage.clips': 'Clips',
    'stage.shop': 'Shop',
    'stage.end': 'End',

    // Accueil
    'home.newAlbum': 'New album',
    'home.gallery': 'Gallery',
    'home.photos': 'Photos',
    'home.videos': 'Videos',
    'home.clips': 'Clips',
    'home.merch': 'Merch',
    'home.viewShop': 'View the shop',
    'home.seeAll': 'See all 9 tracks',
    'home.officialClip': 'Official video',
    'home.visualizer': 'Visualizer',
    'home.soon': 'Soon',
    'home.downloadWallpaper': 'Download the wallpaper',
    'home.videoCount': (n, total) => `${n} of ${total} tracks have a video`,

    // Musique
    'music.listen': 'Listen',
    'music.title': 'Music',
    'music.backToAlbum': 'Back to the album',
    'music.openSpotify': 'Open in Spotify',
    'music.play': 'Play',
    'music.watchClip': 'Watch clip',

    // Boutique
    'shop.title': 'Shop',
    'shop.all': 'All',
    'shop.products': 'Products',
    'shop.combos': 'Combos',
    'shop.addToCart': 'Add to cart',
    'shop.empty': 'Nothing in this category.',
    'shop.cart': 'Cart',
    'shop.cartEmpty': 'Your cart is empty.',
    'shop.total': 'Total',
    'shop.checkout': 'Checkout',
    'shop.remove': 'Remove',
    'shop.delivery': (d) => `Delivery within ${d} days`,
    'shop.shippingNote': 'International shipping — shipping cost communicated at purchase. All sales final.',
    'shop.limited': (n) => `Limited edition — ${n} copies`,
    'shop.orderTitle': 'Your order',
    'shop.orderIntro': 'Leave your details — we’ll get back to you by phone or email to finalize the order.',
    'shop.firstName': 'First name',
    'shop.lastName': 'Last name',
    'shop.address': 'Address',
    'shop.phone': 'Phone',
    'shop.placeOrder': 'Place the order',
    'shop.sending': 'Sending…',
    'shop.orderOk': 'Order received. We’ll contact you by phone or email to finalize it.',
    'shop.orderError': 'Something broke — try again.',

    // Presskit
    'press.media': 'Media',
    'press.title': 'Presskit',
    'press.contacts': 'Contacts',
    'press.about': 'About',
    'press.albumSheet': 'Album facts',
    'press.resources': 'Resources',
    'press.write': 'Write a message',
    'press.send': 'Send',
    'press.yourEmail': 'Your email',
    'press.yourMessage': 'Your message',
    'press.yourName': 'Your name',
    'press.contactOk': 'Message sent. We’ll get back to you by email.',
    'press.contactError': 'Something broke — try again.',

    // Pied de page
    'footer.newsletter': 'Join the newsletter',
    'footer.help': 'Help & support',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms',
    'footer.cookies': 'Cookies',
    'footer.rights': '© 2026 WINGZ. All rights reserved.',
    'footer.madeBy': 'Site designed and built by',
    'footer.subscribed': 'You’re in. Talk soon.',
    'footer.subscribeError': 'Something broke — try again.',

    // Divers
    'common.close': 'Close',
  },

  fr: {
    'nav.music': 'Musique',
    'nav.shop': 'Shop',
    'nav.presskit': 'Presskit',
    'nav.home': 'Accueil',
    'nav.search': 'Rechercher',
    'nav.cart': 'Panier',
    'nav.searchPlaceholder': 'Rechercher un titre, un produit…',

    'stage.scroll': 'Défiler',
    'stage.intro': 'Intro',
    'stage.album': 'Album',
    'stage.photos': 'Photos',
    'stage.clips': 'Clips',
    'stage.shop': 'Shop',
    'stage.end': 'Fin',

    'home.newAlbum': 'Nouvel album',
    'home.gallery': 'Galerie',
    'home.photos': 'Photos',
    'home.videos': 'Vidéos',
    'home.clips': 'Clips',
    'home.merch': 'Merch',
    'home.viewShop': 'Voir la boutique',
    'home.seeAll': 'Voir les 9 titres',
    'home.officialClip': 'Clip officiel',
    'home.visualizer': 'Visualiseur',
    'home.soon': 'Bientôt',
    'home.downloadWallpaper': "Télécharger le fond d'écran",
    'home.videoCount': (n, total) => `${n} titre${n > 1 ? 's' : ''} sur ${total} ont une vidéo`,

    'music.listen': 'Écouter',
    'music.title': 'Musique',
    'music.backToAlbum': "Revenir à l'album",
    'music.openSpotify': 'Ouvrir dans Spotify',
    'music.play': 'Écouter',
    'music.watchClip': 'Voir le clip',

    'shop.title': 'Shop',
    'shop.all': 'Tout',
    'shop.products': 'Produits',
    'shop.combos': 'Combos',
    'shop.addToCart': 'Ajouter au panier',
    'shop.empty': 'Aucun article dans cette catégorie.',
    'shop.cart': 'Panier',
    'shop.cartEmpty': 'Votre panier est vide.',
    'shop.total': 'Total',
    'shop.checkout': 'Commander',
    'shop.remove': 'Retirer',
    'shop.delivery': (d) => `Livraison sous ${d} jours`,
    'shop.shippingNote': "Livraison internationale — frais d'expédition communiqués à l'achat. Toute vente est finale.",
    'shop.limited': (n) => `Édition limitée — ${n} exemplaires`,
    'shop.orderTitle': 'Votre commande',
    'shop.orderIntro': 'Laissez vos coordonnées — on revient vers vous par téléphone ou par courriel pour finaliser la commande.',
    'shop.firstName': 'Prénom',
    'shop.lastName': 'Nom',
    'shop.address': 'Adresse',
    'shop.phone': 'Téléphone',
    'shop.placeOrder': 'Envoyer la commande',
    'shop.sending': 'Envoi…',
    'shop.orderOk': 'Commande reçue. On vous recontacte par téléphone ou courriel pour finaliser.',
    'shop.orderError': 'Un problème est survenu — réessayez.',

    'press.media': 'Médias',
    'press.title': 'Presskit',
    'press.contacts': 'Contacts',
    'press.about': 'À propos',
    'press.albumSheet': 'Fiche album',
    'press.resources': 'Ressources',
    'press.write': 'Écrire un message',
    'press.send': 'Envoyer',
    'press.yourEmail': 'Votre courriel',
    'press.yourMessage': 'Votre message',
    'press.yourName': 'Votre nom',
    'press.contactOk': 'Message envoyé. On vous recontacte par courriel.',
    'press.contactError': 'Un problème est survenu — réessayez.',

    'footer.newsletter': "S'inscrire à l'infolettre",
    'footer.help': 'Aide & support',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions générales',
    'footer.cookies': 'Cookies',
    'footer.rights': '© 2026 WINGZ. Tous droits réservés.',
    'footer.madeBy': 'Site conçu et réalisé par',
    'footer.subscribed': 'C’est noté. À bientôt.',
    'footer.subscribeError': 'Un problème est survenu — réessayez.',

    'common.close': 'Fermer',
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof localStorage === 'undefined') return 'en';
    return localStorage.getItem('wingz-lang') === 'fr' ? 'fr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('wingz-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggle: () => setLang((l) => (l === 'en' ? 'fr' : 'en')),
      // `t` accepte des entrées texte ou fonction (pour les pluriels).
      t: (key, ...args) => {
        const entry = STRINGS[lang][key] ?? STRINGS.en[key];
        if (entry === undefined) return key;
        return typeof entry === 'function' ? entry(...args) : entry;
      },
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang doit être utilisé dans un <LangProvider>');
  return ctx;
}
