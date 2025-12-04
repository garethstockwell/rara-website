// Add 3D buildings

export function addBuildingsLayer(map, options) {
  const id = options.id;

  map.on("load", () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;

    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
      if (
        layers[i].type === "symbol" &&
        "layout" in layers[i] &&
        layers[i].layout["text-field"]
      ) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    map.addSource(id, {
      url: `https://tiles.openfreemap.org/planet`,
      type: "vector",
    });

    map.addLayer(
      {
        id,
        source: id,
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 15,
        filter: ["!=", ["get", "hide_3d"], true],
        layout: {
          visibility: options.visible ? "visible" : "none",
        },
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["get", "render_height"],
            0,
            "lightgray",
            200,
            "royalblue",
            400,
            "lightblue",
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            16,
            ["get", "render_height"],
          ],
          "fill-extrusion-base": [
            "case",
            [">=", ["get", "zoom"], 16],
            ["get", "render_min_height"],
            0,
          ],
        },
      },
      labelLayerId,
    );

    if (options.callback) {
      options.callback(["buildings", id]);
    }
  });
}
