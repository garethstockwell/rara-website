// Layer component

/**
 * Class for managing z-order of a stack of layers
 * Based on https://qubika.com/blog/effectively-manage-layer-order-mapbox-gl-js/
 */
class ZOrder {
  #order;

  /**
   * Create a ZOrder
   * @param {maplibregl.Map} map   The map
   * @param {Array.<string>} order List of layer IDs, lowest to highest
   */
  constructor(map, order) {
    this.#order = order;

    map.on('load', () => {
      map.addSource('empty', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      for (let i = this.#order.length - 1; i >= 0; i--) {
        map.addLayer(
          {
            id: `z-${i}`,
            type: 'symbol',
            source: 'empty',
          },
          i === this.#order.length - 1 ? undefined : `z-${i + 1}`
        );
      }
    });
  }

  /**
   * Get index of layer
   * @param {string} layerId
   * @return Index of layer
   */
  getPosition(layerId) {
    if (!this.#order.includes(layerId)) {
      throw new Error(`Layer ${layerId} not included as a sortable layer`);
    }

    return `z-${this.#order.indexOf(layerId)}`;
  }
}

/**
 * Wrapper around a maplibregl Layer
 */
class Layer {
  #id;
  #manager;
  #visible;
  #callback;

  /**
   * Create a Layer
   * @param {LayerManager} manager  The parent manager
   * @param {string}       id       The layer ID
   * @param {boolean}      visible  Layer visibility
   * @param                callback
   */
  constructor(manager, id, visible, callback) {
    console.debug(`Layer.create id=${id} visible=${visible}`);
    this.#id = id;
    this.#manager = manager;
    this.#visible = visible;
    this.#callback = callback;
  }

  set visible(visible) {
    console.debug(`Layer.setVisible id=${this.#id} visible=${visible}`);
    this.#visible = visible;
    this.#onVisibleChange();
  }

  get visible() {
    return this.#visible;
  }

  /**
   * Callback when map is loaded
   */
  onLoaded() {
    console.debug(
      `Layer.onLoaded id=${this.#id} visible=${this.visible} callback=${this.#callback}`
    );
    this.#onVisibleChange();
    if (this.#callback) {
      this.#callback(this.#id);
    }
  }

  /**
   * Toggle visibility
   * @return {boolean} Updated visibility
   */
  toggleVisible() {
    console.debug(`Layer.toggleVisible id=${this.#id} visible=${this.visible}`);

    this.visible = this.#manager.map.getLayoutProperty(this.#id, 'visibility') !== 'visible';

    return this.visible;
  }

  #onVisibleChange() {
    console.debug(`Layer.onVisibleChange id=${this.#id} visible=${this.visible}`);
    this.#manager.map.setLayoutProperty(this.#id, 'visibility', this.visible ? 'visible' : 'none');
  }
}

/**
 * Manager of a stack of layers
 */
export class LayerManager {
  #layers;
  #map;
  #menu;
  #zOrder;

  /**
   * Create a LayerManager
   * @param {Object}         args        The arguments
   * @param {maplibregl.Map} args.map    The map
   * @param {Array<string>}  args.zOrder List of layer IDs, lowest to highest
   * @param {Menu}           args.menu   The menu
   */
  constructor(args) {
    this.#layers = {};
    this.#map = args.map;
    this.#menu = args.menu;
    this.#zOrder = new ZOrder(args.map, args.zOrder);
  }

  /**
   * Get map
   * @return {maplibregl.Map}
   */
  get map() {
    return this.#map;
  }

  /**
   * Get layer
   * @param {string} id Layer id
   * @return {Layer}
   */
  getLayer(id) {
    return this.#layers[id];
  }

  /**
   * Get zOrder
   * @return {ZOrder}
   */
  get zOrder() {
    return this.#zOrder;
  }

  /**
   * Add a layer
   * @param          func Layer creation function
   * @param {Object} args Arguments to pass to addFunc
   */
  addLayer(func, args) {
    args.visible = args.visible ?? true;
    const layer = this.#addLayer(args.id, args.visible, args.callback);

    args.callback = (id) => {
      layer.onLoaded();
    };
    args.zOrder = this.#zOrder;
    func(this.#map, args);

    const addToMenu = args.addToMenu ?? true;
    if (addToMenu) {
      this.#menu.addItem({
        id: args.id,
        text: args.text,
        onclick: () => {
          return layer.toggleVisible();
        },
        active: args.visible,
        color: args.color,
      });
    }
  }

  #addLayer(id, visible, callback) {
    const layer = new Layer(this, id, visible, callback);
    this.#layers[id] = layer;
    return layer;
  }
}
