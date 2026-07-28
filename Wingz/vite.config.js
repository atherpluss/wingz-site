import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react()],
  // Domaine personnalisé (wingz.online) : le site est servi à la racine,
  // pas sous /wingz-site/ comme pour une Project Page GitHub sans domaine.
  base: '/',
  server: {
    port: 5180,
  },
}));