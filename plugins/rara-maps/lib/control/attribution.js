// Attributions

const attributions = [];
let attributionControl = null;

const position = "bottom-left";

export function addAttribution(map, attribution) {
  if (!attributions.includes(attribution)) {
    attributions.push(attribution);
  }

  if (attributionControl) {
    map.removeControl(attributionControl);
  }

  attributionControl = new maplibregl.AttributionControl({
    compact: true,
    customAttribution: `<br>${attributions.join("<br>")}`,
  });

  map.addControl(attributionControl, position);

  // Collapse the control
  const controlElem = document.getElementsByClassName(
    `maplibregl-ctrl-${position}`,
  )[0];
  const containerElem = controlElem.getElementsByTagName("details")[0];
  containerElem.classList.remove("maplibregl-compact-show");
  containerElem.removeAttribute("open");
}
