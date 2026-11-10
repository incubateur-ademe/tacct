import * as maplibregl from 'maplibre-gl';

maplibregl.setWorkerUrl(
  new URL(
    'maplibre-gl/dist/maplibre-gl-worker.mjs',
    import.meta.url
  ).toString()
);

export default maplibregl;
