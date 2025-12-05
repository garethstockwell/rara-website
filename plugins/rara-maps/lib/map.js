// Map component

import { LayerManager } from './layer.js';
import { Menu } from './menu.js';
import { PopupManager } from './popup.js';

import { addBuildingsLayer } from './buildings.js';
import { addLineLayer } from './line.js';
import { addLocationsLayer } from './locations.js';
import { addOverlayLayer } from './overlay.js';

import { absUrl } from './url.js';

function addNavigationControl(map) {
  map.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
      visualizeRoll: true,
      showZoom: true,
      showCompass: true,
    })
  );

  map.addControl(new maplibregl.FullscreenControl());

  map.addControl(new maplibregl.ScaleControl(), 'bottom-right');
}

/**
 * Create a Map
 * @param {Object}        args        The arguments
 * @param {Object}        args.config Map configuration
 * @param {Array<string>} args.zOrder List of layer IDs, lowest to highest
 */
function Map(args) {
  console.debug('Map', args);

  const map = new maplibregl.Map(args.config);

  const menu = new Menu();

  const layerManager = new LayerManager({
    map,
    menu,
    zOrder: args.zOrder ?? [],
  });

  const popupManager = new PopupManager({
    map,
  });

  map.appData = {
    layers: layerManager,
    popups: popupManager,
  };

  addNavigationControl(map);

  return map;
}

/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
export default function createMap(args) {
  args = args ?? {
    overlay_opacity: 1.0,
  };

  const view = args.data.view;

  const config = {
    ...view.config,
    style: typeof view.config.style === 'string' ? absUrl(view.config.style) : view.config.style,
    container: args.container,
    attributionControl: false,
  };

  const zOrder = view.layers.map((layer) => layer.id);

  const map = new Map({
    config,
    zOrder,
  });

  const attributions = args.data.attributions;

  view.layers.forEach((element) => {
    if (element.type === 'buildings') {
      map.appData.layers.addLayer(addBuildingsLayer, {
        id: element.id,
        visible: element.visible,
      });
    }

    if (element.type === 'line') {
      const line = args.data.lines.find((line) => line.properties.id === element.id);
      map.appData.layers.addLayer(addLineLayer, {
        id: element.id,
        data: line,
        color: element.color,
        visible: element.visible,
      });
    }

    if (element.type === 'locations') {
      map.appData.layers.addLayer(addLocationsLayer, {
        id: element.id,
        data: args.data.locations,
        tags: element.tags,
        color: element.color,
        visible: element.visible,
        onclick: args.locationOnClick ?? null,
        onenter: args.locationOnEnter ?? null,
        onleave: args.locationOnLeave ?? null,
      });
    }

    if (element.type === 'overlay') {
      const overlay = args.data.overlays.features.find((o) => o.properties.id === element.id);
      map.appData.layers.addLayer(addOverlayLayer, {
        id: element.id,
        url: absUrl(overlay.properties.url),
        coordinates: overlay.geometry.coordinates,
        attribution: overlay.properties.attribution
          ? attributions[overlay.properties.attribution]
          : null,
        opacity: 1.0,
        visible: element.visible,
      });
    }

    if (element.type === 'point') {
      map.on('load', () => {
        map.addSource(element.id, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [0.0, 0.0],
            },
          },
        });

        map.addLayer(
          {
            id: element.id,
            source: element.id,
            type: 'circle',
            paint: {
              'circle-radius': 10,
              'circle-color': '#ff0000',
              'circle-stroke-width': 2,
              'circle-stroke-color': 'white',
            },
          },
          map.appData.layers.zOrder.getPosition(element.id)
        );
      });
    }
  });

  return map;
}
