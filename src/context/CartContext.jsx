import { createContext, useContext, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'remove':
      return state.filter((i) => i.id !== action.id);
    case 'setQty': {
      // Retirer l'article plutôt que de laisser une quantité nulle traîner.
      if (action.qty < 1) return state.filter((i) => i.id !== action.id);
      return state.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i));
    }
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [viewed, setViewed] = useState(null); // fiche produit ouverte
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.qty * i.price, 0);
    return {
      items,
      count,
      total,
      isOpen,
      viewed,
      viewProduct: (p) => setViewed(p),
      closeProduct: () => setViewed(null),
      checkoutOpen,
      openCheckout: () => {
        setOpen(false);
        setCheckoutOpen(true);
      },
      closeCheckout: () => setCheckoutOpen(false),
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      // Ouvrir le panier à l'ajout donne un retour visuel immédiat.
      addItem: (product) => {
        dispatch({ type: 'add', product });
        setOpen(true);
      },
      removeItem: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [items, isOpen, viewed, checkoutOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>');
  return ctx;
}
