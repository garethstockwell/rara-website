// Popup component

class Popup {
  #id;
  #data;
  #manager;
  #popup;
  #popupVisible;

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
    this.#popupVisible = false;
  }

  get popupVisible() {
    return this.#popupVisible;
  }

  set popupVisible(visible) {
    console.debug(`Popup.setPopupVisible id=${this.#id} visible=${visible}`);
    this.#popupVisible = visible;
    this.#onPopupVisibleChange();
  }

  #onPopupVisibleChange() {
    console.debug(
      `Popup.onPopupVisibleChange id=${this.#id} visible=${this.popupVisible} popup=${this.#popup}`
    );
    if (this.#popup) {
      this.#popup.getElement().style.visibility = this.popupVisible ? 'visible' : 'hidden';
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
