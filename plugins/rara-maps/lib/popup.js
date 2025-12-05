// Popup component

class Popup {
  #id;
  #manager;
  #popup;
  #visibleDynamic;
  #visibleStatic;

  /**
   * Create a Popup
   * @param {PopupManager} manager The parent manager
   * @param {string}          id   The location ID
   */
  constructor(manager, id) {
    console.debug(`Popup.create id=${id}`);
    this.#id = id;
    this.#manager = manager;
    this.#popup = null;
    this.#visibleDynamic = false;
    this.#visibleStatic = false;
  }

  get visibleDynamic() {
    return this.#visibleDynamic;
  }

  set visibleDynamic(visible) {
    console.debug(`Popup.setVisibleDynamic id=${this.#id} visible=${visible}`);
    this.#visibleDynamic = visible;
    this.#onPopupVisibleChange();
  }

  get visibleStatic() {
    return this.#visibleStatic;
  }

  set visibleStatic(visible) {
    console.debug(`Popup.setVisibleStatic id=${this.#id} visible=${visible}`);
    this.#visibleStatic = visible;
    this.#onPopupVisibleChange();
  }

  setData(data) {
    console.debug(`Popup.setData id=${this.#id} data=${data}`);
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
      `Popup.onPopupVisibleChange id=${this.#id} dynamic=${this.visibleDynamic} static=${this.visibleStatic} popup=${this.#popup}`
    );
    const visible = this.visibleDynamic || this.visibleStatic;
    if (this.#popup) {
      this.#popup.getElement().style.visibility = visible ? 'visible' : 'hidden';
    }
  }
}

/**
 * Manager of a set of popups
 */
export class PopupManager {
  #popups;
  #map;

  /**
   * Create a PopupManager
   * @param {Object}         args     The arguments
   * @param {maplibregl.Map} args.map The map
   */
  constructor(args) {
    this.#popups = {};
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
   * Get popup
   * @param {string} id Popup id
   * @return {Popup}
   */
  getPopup(id) {
    if (!(id in this.#popups)) {
      this.#addPopup(id);
    }
    return this.#popups[id];
  }

  #addPopup(id) {
    console.debug('PopupManager.addPopup', id);
    const popup = new Popup(this, id);
    this.#popups[id] = popup;
    return popup;
  }
}
