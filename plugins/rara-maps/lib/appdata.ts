import type maplibregl from 'maplibre-gl';

export interface AppData {
  layers: any;
  popups: any;
}

const appDataStore = new WeakMap<maplibregl.Map, AppData>();

export function setAppData(map: maplibregl.Map, data: AppData) {
  appDataStore.set(map, data);
}

export function getAppData(map: maplibregl.Map): AppData | undefined {
  return appDataStore.get(map);
}
