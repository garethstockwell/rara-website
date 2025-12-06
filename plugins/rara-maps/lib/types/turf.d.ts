// Make this a module so `--isolatedModules` setups are happy
import type * as T from 'turf';
export {};

declare global {
  // Expose the package's exported type shape as the runtime global `turf`
  const turf: T;
}
