// Add a map layer which shows an image

import { addAttribution } from "../control/attribution.js";

export function addOverlayLayer(map, options) {
  map.on("load", () => {
    // Add image source
    map.addSource(options.id, {
      type: "image",
      url: options.url,
      coordinates: options.coordinates,
    });

    // Add raster layer using that source
    map.addLayer(
      {
        id: options.id,
        type: "raster",
        source: options.id,
        paint: {
          "raster-opacity": options.opacity ?? 1.0,
        },
        layout: {
          visibility: options.visible ? "visible" : "none",
        },
      },
      options.zOrder ? options.zOrder.getPosition(options.id) : null,
    );

    if (options.attribution) {
      addAttribution(map, options.attribution);
    }

    if (options.callback) {
      options.callback(["overlay", options.id]);
    }
  });
}
