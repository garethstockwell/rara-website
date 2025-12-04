// Location component

class Location {
  #id;
  #data;
  #manager;
  #popup;
  #popupVisible;

  /**
   * Create a Location
   * @param {LocationManager} manager The parent manager
   * @param {string}          id      The location ID
   */
  constructor(manager, id) {
    console.debug(`Location.create id=${id}`);
    this.#id = id;
    this.#data = null;
    this.#manager = manager;
    this.#popup = null;
    this.#popupVisible = false;
  }

  get data() {
    return this.#data;
  }

  get popupVisible() {
    return this.#popupVisible;
  }

  set popupVisible(visible) {
    console.debug(`Location.setPopupVisible id=${this.#id} visible=${visible}`);
    this.#popupVisible = visible;
    this.#onPopupVisibleChange();
  }

  setData(data) {
    console.debug(`Location.setData id=${this.#id} data=${data}`);
    this.#data = data;
    this.#popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    this.#popup
      .setLngLat(data.geometry.coordinates)
      .setHTML(data.properties.title)
      .addTo(this.#manager.map);

    this.#onPopupVisibleChange();
  }

  #onPopupVisibleChange() {
    console.debug(
      `Location.onPopupVisibleChange id=${this.#id} visible=${
        this.popupVisible
      } popup=${this.#popup}`
    );
    if (this.#popup) {
      this.#popup.getElement().style.visibility = this.popupVisible ? 'visible' : 'hidden';
    }
  }
}

/**
 * Manager of a set of locations
 */
export class LocationManager {
  #locations;
  #map;

  /**
   * Create a LocationManager
   * @param {Object}         args     The arguments
   * @param {maplibregl.Map} args.map The map
   */
  constructor(args) {
    this.#locations = {};
    this.#map = args.map;
  }

  /**
   * Get map
   * @return {maplibregl.Map}
   */
  get map() {
    return this.#map;
  }

  /**
   * Get location
   * @param {string} id Location id
   * @return {Location}
   */
  getLocation(id) {
    if (!(id in this.#locations)) {
      this.#addLocation(id);
    }
    return this.#locations[id];
  }

  #addLocation(id) {
    console.debug('LocationManager.addLocation', id);
    const popup = new Location(this, id);
    this.#locations[id] = popup;
    return popup;
  }
}
