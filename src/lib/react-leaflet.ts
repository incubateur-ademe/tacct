// Ce module exporte conditionnellement les liaisons react-leaflet uniquement côté client.
// Leaflet référence `window` lors de l'évaluation du module, ce qui casse le rendu côté serveur (SSR).
// Nous évitons de requérir `react-leaflet` côté serveur et fournissons des alternatives sûres (no-op)
// afin que les composants serveur puissent importer ce fichier sans planter.

import { Any } from "./utils/types";

const isClient = typeof window !== 'undefined';

let _rl: Any = undefined;
let _leaflet: Any = undefined;
if (isClient) {
  // requérir dynamiquement à l'exécution pour éviter l'importation ESM statique lors du SSR
  _rl = require('react-leaflet');
  _leaflet = require('leaflet');
}

const noopComponent = (_props: Any) => null;
const noopObject = new Proxy(
  {},
  {
    get: () => () => ({})
  }
);

export const MapContainer = isClient ? _rl.MapContainer : noopComponent;
export const GeoJSON = isClient ? _rl.GeoJSON : noopComponent;
export const TileLayer = isClient ? _rl.TileLayer : noopComponent;
export const Marker = isClient ? _rl.Marker : noopComponent;
export const Popup = isClient ? _rl.Popup : noopComponent;
export const L = isClient ? _leaflet : noopObject;

export const useMap = isClient
  ? _rl.useMap
  : () => {
      throw new Error('useMap can only be used in client components');
    };
