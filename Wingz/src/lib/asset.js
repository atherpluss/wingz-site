// Préfixe les chemins publics (/img, /video) avec le base path de build
// (ex. "/wingz-site/" sur GitHub Pages), sinon ils pointent à la racine du
// domaine une fois déployés et cassent.
export function asset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
