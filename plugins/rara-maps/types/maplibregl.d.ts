// Make this a module so `--isolatedModules` setups are happy
import type * as ML from 'maplibre-gl';
export {};

declare global {
  // Expose the package's exported type shape as the runtime global `maplibregl`
  const maplibregl: typeof ML;
}
