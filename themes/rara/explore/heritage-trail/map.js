
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire48b6"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire48b6"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("5xtjF", function(module, exports) {

$parcel$export(module.exports, "Commentary", () => $4086c668fa7aedb0$export$ae67abe6ac4b2557);
// Commentary component
class $4086c668fa7aedb0$export$ae67abe6ac4b2557 {
    #elems;
    #elemIds;
    #index;
    #activeId;
    #prevButtons;
    #prevLabels;
    #nextButtons;
    #nextLabels;
    #callback;
    /**
   * Construct a Commentary object
   * @param {Object}   args          The arguments
   * @param {function} args.callback Callback function
   */ constructor(args){
        this.#elems = document.querySelectorAll(".commentary");
        this.#elems.forEach((el)=>el.style = 'display: none;');
        this.#elemIds = Array.from(this.#elems).map((el)=>el.id);
        this.#index = 0;
        this.#activeId = this.#elemIds[this.#index];
        this.#prevButtons = document.querySelectorAll('.prev-button');
        this.#prevLabels = document.querySelectorAll('.prev-label');
        this.#nextButtons = document.querySelectorAll('.next-button');
        this.#nextLabels = document.querySelectorAll('.next-label');
        this.#prevButtons.forEach((el)=>el.addEventListener('click', (e)=>this.#onPrev()));
        this.#nextButtons.forEach((el)=>el.addEventListener('click', (e)=>this.#onNext()));
        this.#callback = args.callback;
    }
    /**
   * Get commentary identifiers
   */ get ids() {
        return this.#elemIds;
    }
    /**
   * Set active identifier
   * @param {string} id Identifier 
   */ setIndex(index) {
        const oldId = this.#activeId;
        this.#index = index;
        this.#activeId = this.#elemIds[this.#index];
        console.debug(`Commentary.setIndex ${oldId} -> ${index} ${this.#activeId}`);
        const oldElem = document.querySelector('#' + oldId);
        oldElem.style.display = 'none';
        const newElem = document.querySelector('#' + this.#activeId);
        newElem.style.display = 'block';
        if (this.#index > 0) {
            this.#prevButtons.forEach((el)=>el.style.visibility = 'visible');
            this.#prevLabels.forEach((el)=>el.textContent = document.querySelector('#' + this.#elemIds[this.#index - 1]).querySelector('h1').textContent);
        } else this.#prevButtons.forEach((el)=>el.style.visibility = 'hidden');
        if (this.#index + 1 < this.#elemIds.length) {
            this.#nextButtons.forEach((el)=>el.style.visibility = 'visible');
            this.#nextLabels.forEach((el)=>el.textContent = document.querySelector('#' + this.#elemIds[this.#index + 1]).querySelector('h1').textContent);
        } else this.#nextButtons.forEach((el)=>el.style.visibility = 'hidden');
        if (this.#callback) this.#callback(oldId, this.#activeId);
    }
    #onPrev() {
        this.setIndex((this.#index - 1 + this.#elemIds.length) % this.#elemIds.length);
    }
    #onNext() {
        this.setIndex((this.#index + 1) % this.#elemIds.length);
    }
}

});

parcelRegister("kr3KQ", function(module, exports) {

$parcel$export(module.exports, "Map", () => $ee093dd16ebbc3bc$export$a5c7b93649eaf8f8);
// Map component

var $fiXlL = parcelRequire("fiXlL");

var $dK49P = parcelRequire("dK49P");

var $ZGmnb = parcelRequire("ZGmnb");

var $adV9W = parcelRequire("adV9W");
function $ee093dd16ebbc3bc$var$addNavigationControl(map) {
    map.addControl(new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true
    }));
    map.addControl(new maplibregl.FullscreenControl());
    map.addControl(new maplibregl.ScaleControl(), 'bottom-right');
    function onZoom(e) {
        setTimeout(function() {
            info.update(map);
        }, 700);
    }
    document.getElementsByClassName('maplibregl-ctrl-zoom-in')[0].addEventListener('click', onZoom);
    document.getElementsByClassName('maplibregl-ctrl-zoom-out')[0].addEventListener('click', onZoom);
}
function $ee093dd16ebbc3bc$export$a5c7b93649eaf8f8(args) {
    console.debug("Map", args);
    const map = new maplibregl.Map(args.config);
    const info1 = new (0, $fiXlL.Info)({
        map: map
    });
    const menu = new (0, $ZGmnb.Menu)();
    const layerManager = new (0, $dK49P.LayerManager)({
        map: map,
        menu: menu,
        zOrder: args.zOrder ?? []
    });
    const locationManager = new (0, $adV9W.LocationManager)({
        map: map
    });
    map.appData = {
        layers: layerManager,
        locations: locationManager
    };
    $ee093dd16ebbc3bc$var$addNavigationControl(map);
    return map;
}

});
parcelRegister("fiXlL", function(module, exports) {

$parcel$export(module.exports, "Info", () => $b24693211f676c4c$export$c4868e4a24d48fad);
// Information panel
class $b24693211f676c4c$export$c4868e4a24d48fad {
    #elem;
    #event;
    #freeze;
    #map;
    /**
   * Create an Info panel
   * @param {Object}         args        The arguments
   * @param {maplibregl.Map} args.map    The map
   */ constructor(args){
        this.#elem = document.getElementById('info');
        this.#event = null;
        this.#freeze = false;
        this.#map = args.map;
        if (this.#elem) {
            const handleKeyDown = (e)=>{
                if (e.key === "f") this.#freeze = !this.#freeze;
                if (e.key === "i") this.#toggleVisible();
            };
            document.addEventListener('keydown', handleKeyDown, true);
            this.#map.on('mousemove', (e)=>{
                this.#event = e;
                this.#update();
            });
        }
    }
    #toggleVisible() {
        this.#elem.style.display = this.#elem.style.display == 'block' ? 'none' : 'block';
    }
    #update() {
        if (!this.#freeze) this.#elem.innerHTML = `${// e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        this.#event ? JSON.stringify(this.#event.point) : ''} zoom:${this.#map.getZoom()}<br />
        ${// e.lngLat is the longitude, latitude geographical position of the event
        this.#event ? JSON.stringify(this.#event.lngLat.wrap()) : ''}`;
    }
}

});

parcelRegister("dK49P", function(module, exports) {

$parcel$export(module.exports, "LayerManager", () => $a012cbd647ad77b8$export$eff87c52915dd7fe);
// Layer component
/**
 * Class for managing z-order of a stack of layers
 * Based on https://qubika.com/blog/effectively-manage-layer-order-mapbox-gl-js/
 */ class $a012cbd647ad77b8$var$ZOrder {
    #order;
    /**
   * Create a ZOrder
   * @param {maplibregl.Map} map   The map
   * @param {Array.<string>} order List of layer IDs, lowest to highest
   */ constructor(map, order){
        this.#order = order;
        map.on('load', ()=>{
            map.addSource('empty', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });
            for(let i = this.#order.length - 1; i >= 0; i--)map.addLayer({
                id: `z-${i}`,
                type: 'symbol',
                source: 'empty'
            }, i == this.#order.length - 1 ? undefined : `z-${i + 1}`);
        });
    }
    /**
   * Get index of layer
   * @param {string} layerId 
   * @returns Index of layer
   */ getPosition(layerId) {
        if (!this.#order.includes(layerId)) throw new Error(`Layer ${layerId} not included as a sortable layer`);
        return `z-${this.#order.indexOf(layerId)}`;
    }
}
/**
 * Wrapper around a maplibregl Layer
 */ class $a012cbd647ad77b8$var$Layer {
    #id;
    #manager;
    #visible;
    #callback;
    /**
   * Create a Layer
   * @param {LayerManager} manager The parent manager
   * @param {string}       id      The layer ID
   * @param {boolean}      visible Layer visibility
   */ constructor(manager, id, visible, callback){
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
   */ onLoaded() {
        console.debug(`Layer.onLoaded id=${this.#id} visible=${this.visible} callback=${this.#callback}`);
        this.#onVisibleChange();
        if (this.#callback) this.#callback(this.#id);
    }
    /**
   * Toggle visibility
   * @returns {boolean} Updated visibility
   */ toggleVisible() {
        console.debug(`Layer.toggleVisible id=${this.#id} visible=${this.visible}`);
        this.visible = this.#manager.map.getLayoutProperty(this.#id, 'visibility') !== 'visible';
        return this.visible;
    }
    #onVisibleChange() {
        console.debug(`Layer.onVisibleChange id=${this.#id} visible=${this.visible}`);
        this.#manager.map.setLayoutProperty(this.#id, 'visibility', this.visible ? 'visible' : 'none');
    }
}
class $a012cbd647ad77b8$export$eff87c52915dd7fe {
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
   */ constructor(args){
        this.#layers = {};
        this.#map = args.map;
        this.#menu = args.menu;
        this.#zOrder = new $a012cbd647ad77b8$var$ZOrder(args.map, args.zOrder);
    }
    /**
   * Get map
   * @returns {maplibregl.Map}
   */ get map() {
        return this.#map;
    }
    /**
   * Get layer
   * @param {string} id Layer id
   * @returns {Layer}
   */ getLayer(id) {
        return this.#layers[id];
    }
    /**
   * Get zOrder
   * @returns {ZOrder}
   */ get zOrder() {
        return this.#zOrder;
    }
    /**
   * Add a layer
   * @param {function} addFunc Add layer function 
   * @param {Object}   args    Arguments to pass to addFunc
   */ addLayer(func, args) {
        args.visible = args.visible ?? true;
        const layer = this.#addLayer(args.id, args.visible, args.callback);
        args.callback = (id)=>{
            layer.onLoaded(id);
        };
        args.zOrder = this.#zOrder;
        func(this.#map, args);
        const addToMenu = args.addToMenu ?? true;
        if (addToMenu) this.#menu.addItem({
            id: args.id,
            text: args.text,
            onclick: ()=>{
                return layer.toggleVisible();
            },
            active: args.visible,
            color: args.color
        });
    }
    #addLayer(id, visible, callback) {
        const layer = new $a012cbd647ad77b8$var$Layer(this, id, visible, callback);
        this.#layers[id] = layer;
        return layer;
    }
}

});

parcelRegister("ZGmnb", function(module, exports) {

$parcel$export(module.exports, "Menu", () => $0b968e67a217797d$export$d9b273488cd8ce6f);
// Menu component
class $0b968e67a217797d$export$d9b273488cd8ce6f {
    #elem;
    /**
   * Create a Menu
   */ constructor(){
        this.#elem = document.getElementById('menu');
        if (this.#elem) {
            const handleKeyDown = (e)=>{
                if (e.key === "m") this.#toggleVisible();
            };
            document.addEventListener('keydown', handleKeyDown, true);
        }
    }
    /**
   * Add a menu item
   * @param {Object}   args         The arguments
   * @param {string}   args.id      Layer identifier
   * @param {string}   args.text    Text
   * @param {function} args.onclick Click handler
   * @param {boolean}  args.active  Whether item is active
   * @param {string}   args.color   Item color
   */ addItem(args) {
        if (this.#elem) {
            const link = document.createElement('a');
            link.id = 'menu_' + args.id;
            link.layerId = args.id;
            link.href = '#';
            link.textContent = args.text;
            link.className = args.active ? 'active' : '';
            link.onclick = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                link.className = args.onclick() ? 'active' : '';
            };
            const box = document.createElement('div');
            box.className = 'box';
            box.style.backgroundColor = args.color ?? 'transparent';
            link.appendChild(box);
            this.#elem.appendChild(link);
            this.#show();
        }
    }
    #show() {
        this.#elem.hidden = false;
    }
    #toggleVisible() {
        console.debug("Menu.toggleVisible");
        this.#elem.hidden = !this.#elem.hidden;
    }
}

});

parcelRegister("adV9W", function(module, exports) {

$parcel$export(module.exports, "LocationManager", () => $771774f2d80d879b$export$7d80cc25fac290ca);
// Location component
class $771774f2d80d879b$var$Location {
    #id;
    #data;
    #manager;
    #popup;
    #popupVisible;
    /**
   * Create a Location
   * @param {LocationManager} manager The parent manager
   * @param {string}       id      The location ID
   * @param {boolean}      visible Location visibility
   */ constructor(manager, id, visible){
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
            closeOnClick: false
        });
        this.#popup.setLngLat(data.geometry.coordinates).setHTML(data.properties.title).addTo(this.#manager.map);
        this.#onPopupVisibleChange();
    }
    #onPopupVisibleChange() {
        console.debug(`Location.onPopupVisibleChange id=${this.#id} visible=${this.popupVisible} popup=${this.#popup}`);
        if (this.#popup) this.#popup.getElement().style.visibility = this.popupVisible ? 'visible' : 'hidden';
    }
}
class $771774f2d80d879b$export$7d80cc25fac290ca {
    #locations;
    #map;
    /**
   * Create a LocationManager
   * @param {Object}         args        The arguments
   * @param {maplibregl.Map} args.map    The map
   */ constructor(args){
        this.#locations = {};
        this.#map = args.map;
    }
    /**
   * Get map
   * @returns {maplibregl.Map}
   */ get map() {
        return this.#map;
    }
    /**
   * Get location
   * @param {string} id Location id
   * @returns {Location}
   */ getLocation(id) {
        if (!(id in this.#locations)) this.#addLocation(id);
        return this.#locations[id];
    }
    #addLocation(id) {
        console.debug("LocationManager.addLocation", id);
        const popup = new $771774f2d80d879b$var$Location(this, id);
        this.#locations[id] = popup;
        return popup;
    }
}

});


parcelRegister("ia3VS", function(module, exports) {

$parcel$export(module.exports, "addLineLayer", () => $d38c3613fdb3bc22$export$56f19b12e2d54e37);
// Add a map layer which shows a line
function $d38c3613fdb3bc22$export$56f19b12e2d54e37(map, options) {
    var id = options.id;
    map.on('load', ()=>{
        fetch(options.url).then((res)=>res.json()).then((data)=>{
            map.addSource(id, {
                'type': 'geojson',
                'data': data
            });
            map.addLayer({
                'id': id,
                'type': 'line',
                'source': id,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    'visibility': options.visible ? 'visible' : 'none'
                },
                'paint': {
                    'line-color': options.color,
                    'line-width': 6
                }
            }, options.zOrder ? options.zOrder.getPosition(id) : null);
            if (options.callback) options.callback([
                'line',
                id
            ]);
        });
    });
}

});

// Render a map of the heritage trail

var $5xtjF = parcelRequire("5xtjF");

var $kr3KQ = parcelRequire("kr3KQ");
// Component which allows camera to fly along a route
class $a34bdb8e45e0ca8e$export$e7b0ac011bb776c6 {
    #camera;
    #distance;
    #map;
    #route;
    #startTime;
    #startCoord;
    #startPoint;
    #startDistance;
    #stopCoord;
    #stopPoint;
    #stopDistance;
    #reachedStopDistance;
    #speed;
    #direction;
    /**
   * Create a Route
   * @param {Object}         args           The arguments
   * @param {boolean}        args.autoStart Start flight as soon as route is loaded
   * @param {int}            args.altitude  Camera altitude in meters
   * @param {int}            args.distance  Camera trailing distance in meters
   * @param {string}         args.lineId    Identifier of line to follow
   * @param {maplibregl.Map} args.map       The map
   */ constructor(args){
        this.#camera = {
            coord: null,
            altitude: args.altitude ?? 500,
            distance: null
        };
        this.#distance = args.distance ?? 500;
        this.#map = args.map;
        this.#speed = 0.0001;
        this.#init(args.lineId, args.autoStart ?? false);
    }
    #init(lineId, autoStart) {
        var line = this.#map.getSource(lineId);
        line.getData().then((data)=>{
            console.debug("Route loaded");
            var coordinates = data.features[0].geometry.coordinates;
            this.#route = turf.lineString(coordinates);
            // calculate camera startpoint
            //  - compute the direction of the first quater of the route
            //  - and place the camera in to opposite direction of this point
            let a = maplibregl.MercatorCoordinate.fromLngLat(coordinates[0]);
            let b = maplibregl.MercatorCoordinate.fromLngLat(turf.along(this.#route, turf.lineDistance(this.#route) / 4).geometry.coordinates);
            let dx = b.x - a.x, dy = b.y - a.y;
            this.#camera.distance = this.#distance ?? Math.hypot(dx, dy);
            this.#camera.coord = new maplibregl.MercatorCoordinate(a.x - dx, a.y - dy);
            // FIXME! when using flyTo the positioning is not correct
            this.#map.jumpTo(this.#map.calculateCameraOptionsFromTo(this.#camera.coord.toLngLat(), this.#camera.altitude, coordinates[0]));
            if (autoStart) {
                console.debug("Automatically starting");
                this.#start();
            }
        });
    }
    #start() {
        console.debug("Route.start");
        this.#startDistance = 0;
        this.#stopDistance = null;
        this.#reachedStopDistance = false;
        this.#direction = 1;
        if (this.#startCoord) {
            console.debug("Start coordinates:", this.#startCoord);
            const startPoint = turf.point(this.#startCoord);
            const snappedStartPoint = turf.nearestPointOnLine(this.#route, startPoint);
            this.#startDistance = snappedStartPoint.properties.location;
            console.debug("Start distance (km):", this.#startDistance);
        }
        if (this.#stopCoord) {
            console.debug("Stop coordinates:", this.#stopCoord);
            const stopPoint = turf.point(this.#stopCoord);
            const snappedStopPoint = turf.nearestPointOnLine(this.#route, stopPoint);
            this.#stopDistance = snappedStopPoint.properties.location;
            console.debug("Stop distance (km):", this.#stopDistance);
        }
        if (this.#stopDistance && this.#stopDistance < this.#startDistance) this.#direction = -1;
        this.#startTime = Date.now();
        this.#advance();
    }
    #advance() {
        if (this.#reachedStopDistance) return;
        const now = Date.now();
        let elapsedTime = now - this.#startTime;
        let currentDistance = this.#startDistance + elapsedTime * this.#speed * this.#direction;
        if (!this.#stopDistance) {
            let totalDistance = turf.lineDistance(this.#route);
            currentDistance = currentDistance % totalDistance;
        }
        //console.debug('advance currentDistance=', currentDistance, 'stopDistance=', stopDistance);
        let lngLat = turf.along(this.#route, currentDistance).geometry.coordinates;
        this.#map.getSource('point').setData({
            type: 'Point',
            coordinates: lngLat
        });
        // Let the camera follow the route
        let coord = maplibregl.MercatorCoordinate.fromLngLat(lngLat);
        let dx = coord.x - this.#camera.coord.x, dy = coord.y - this.#camera.coord.y;
        let delta = Math.hypot(dx, dy) - this.#camera.distance;
        if (delta > 0) {
            let a = Math.atan2(dy, dx);
            this.#camera.coord.x += Math.cos(a) * delta;
            this.#camera.coord.y += Math.sin(a) * delta;
        }
        // FIXME! when using easeTo the positioning is not correct
        this.#map.jumpTo(this.#map.calculateCameraOptionsFromTo(this.#camera.coord.toLngLat(), this.#camera.altitude, lngLat));
        // Determine whether stop point has been reached
        if (this.#stopDistance !== null && (this.#direction > 0 && currentDistance >= this.#stopDistance || this.#direction < 0 && currentDistance <= this.#stopDistance)) {
            this.#reachedStopDistance = true;
            console.debug("Stopped at distance:", this.#stopDistance);
            return;
        }
        requestAnimationFrame(()=>{
            this.#advance();
        });
    }
    /**
   * Fly from start position to stop position
   * @param {[float, float]} startPos Start position, expressed as [lat, lng]
   * @param {[float, float]} stopPos  Stop position, expressed as [lat, lng]
   */ fly(startPos, stopPos) {
        console.debug('Fly from', startPos, 'to', stopPos);
        this.#startCoord = startPos;
        this.#stopCoord = stopPos;
        this.#reachedStopDistance = false;
        if (this.#route) this.#start();
    }
}


// Add 3D buildings
function $2acda222c2a7751f$export$6e8a7b6ebe63378e(map, options) {
    var id = options.id;
    map.on('load', ()=>{
        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
        let labelLayerId;
        for(let i = 0; i < layers.length; i++)if (layers[i].type === 'symbol' && 'layout' in layers[i] && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
        map.addSource(id, {
            url: `https://tiles.openfreemap.org/planet`,
            type: 'vector'
        });
        map.addLayer({
            id: id,
            source: id,
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 15,
            filter: [
                '!=',
                [
                    'get',
                    'hide_3d'
                ],
                true
            ],
            layout: {
                'visibility': options.visible ? 'visible' : 'none'
            },
            paint: {
                'fill-extrusion-color': [
                    'interpolate',
                    [
                        'linear'
                    ],
                    [
                        'get',
                        'render_height'
                    ],
                    0,
                    'lightgray',
                    200,
                    'royalblue',
                    400,
                    'lightblue'
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    [
                        'linear'
                    ],
                    [
                        'zoom'
                    ],
                    15,
                    0,
                    16,
                    [
                        'get',
                        'render_height'
                    ]
                ],
                'fill-extrusion-base': [
                    'case',
                    [
                        '>=',
                        [
                            'get',
                            'zoom'
                        ],
                        16
                    ],
                    [
                        'get',
                        'render_min_height'
                    ],
                    0
                ]
            }
        }, labelLayerId);
        if (options.callback) options.callback([
            'buildings',
            id
        ]);
    });
}



var $ia3VS = parcelRequire("ia3VS");
// Add a map layer which shows locations
/**
 * Create the map
 * @param {Object} args              The arguments
 */ function $14aeb3418f82918c$export$d3ed3c083b4b95c3(map, args) {
    map.on('load', async ()=>{
        var id = args.id;
        const locations = map.appData.locations;
        const image = await map.loadImage('/assets/icons/pin-' + args.color + '.png');
        map.addImage(id, image.data);
        fetch(args.url).then((res)=>res.json()).then((data)=>{
            if (args.tags) data.features = data.features.filter((feature)=>args.tags.every((x)=>feature.properties.tags.includes(x)));
            data.features.forEach((feature)=>{
                const loc = locations.getLocation(feature.properties.id);
                loc.setData(feature);
                if (args.staticPopups) loc.popupVisible = true;
            });
            map.addSource(id, {
                'type': 'geojson',
                'data': data
            });
            map.addLayer({
                'id': id,
                'type': 'symbol',
                'source': id,
                'layout': {
                    'icon-image': id,
                    'icon-size': 1.0,
                    'icon-allow-overlap': true,
                    'visibility': args.visible ? 'visible' : 'none'
                }
            }, args.zOrder ? args.zOrder.getPosition(id) : null);
            if (!args.staticPopups) {
                // Make sure to detect marker change for overlapping markers
                // and use mousemove instead of mouseenter event
                let currentFeatureId = undefined;
                let currentFeatureCoordinates = undefined;
                map.on('mousemove', id, (e)=>{
                    const featureCoordinates = e.features[0].geometry.coordinates.toString();
                    if (currentFeatureCoordinates !== featureCoordinates) {
                        currentFeatureCoordinates = featureCoordinates;
                        // Change the cursor style as a UI indicator.
                        map.getCanvas().style.cursor = 'pointer';
                        const coordinates = e.features[0].geometry.coordinates.slice();
                        // Ensure that if the map is zoomed out such that multiple
                        // copies of the feature are visible, the popup appears
                        // over the copy being pointed to.
                        while(Math.abs(e.lngLat.lng - coordinates[0]) > 180)coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        if (currentFeatureId) locations.getLocation(currentFeatureId).popupVisible = false;
                        currentFeatureId = e.features[0].properties.id;
                        locations.getLocation(currentFeatureId).popupVisible = true;
                        if (args.onenter) args.onenter(currentFeatureId);
                    }
                });
                map.on('mouseleave', id, ()=>{
                    const featureId = currentFeatureId;
                    /*
            map.getCanvas().style.cursor = '';
            locations.getLocation(currentFeatureId).popupVisible = false;
            currentFeatureId = undefined;
            currentFeatureCoordinates = undefined;
            */ if (args.onleave) args.onleave(featureId);
                });
            }
            if (args.onclick) map.on('click', id, (e)=>{
                args.onclick(e.features[0].properties.id);
            });
        });
    });
}


var $cda4673139222688$var$route = null;
function $cda4673139222688$export$d49c9aa30b771d59(args) {
    args = args ?? {};
    const config = {
        style: "/data/style.json",
        center: [
            0.144843,
            52.212231
        ],
        zoom: 15,
        container: "map",
        attributionControl: false
    };
    const zOrder = [
        'boundary',
        'heritage_trail',
        'locations',
        'point'
    ];
    var map = new (0, $kr3KQ.Map)({
        config: config,
        zOrder: zOrder
    });
    const locations = map.appData.locations;
    map.on('load', ()=>{
        map.addSource("point", {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [
                        0.0,
                        0.0
                    ]
                }
            }
        });
        map.addLayer({
            id: "point",
            source: "point",
            type: "circle",
            paint: {
                "circle-radius": 10,
                "circle-color": '#ff0000',
                "circle-stroke-width": 2,
                "circle-stroke-color": 'white'
            }
        }, map.appData.layers.zOrder.getPosition('point'));
    });
    map.appData.layers.addLayer((0, $2acda222c2a7751f$export$6e8a7b6ebe63378e), {
        id: '3d_buildings',
        text: '3D buildings',
        color: '#aaaaaa',
        visible: true
    });
    map.appData.layers.addLayer((0, $ia3VS.addLineLayer), {
        id: 'boundary',
        text: 'Riverside area boundary',
        url: '/data/line_boundary.json',
        color: 'black',
        visible: false
    });
    map.appData.layers.addLayer((0, $ia3VS.addLineLayer), {
        id: 'heritage_trail',
        text: 'Heritage trail line',
        url: '/data/line_heritage_trail.json',
        color: 'green',
        callback: (_arguments)=>{
            $cda4673139222688$var$route = new (0, $a34bdb8e45e0ca8e$export$e7b0ac011bb776c6)({
                altitude: 200,
                distance: 500,
                lineId: 'heritage_trail',
                map: map
            });
        },
        visible: true
    });
    map.appData.layers.addLayer((0, $14aeb3418f82918c$export$d3ed3c083b4b95c3), {
        id: 'locations',
        text: 'Heritage trail locations',
        url: '/data/locations.json',
        tags: [
            'attractions'
        ],
        color: 'green',
        onclick: args.locationOnClick ?? null,
        visible: true
    });
    /**
   * Fly from source location to destination location
   * @param {string} fromId Source location identifier
   * @param {string} toId   Destination location identifier
   */ function fly(fromId, toId) {
        console.debug(`Fly from ${fromId} to ${toId}`);
        if (fromId !== toId) {
            const fromCoord = locations.getLocation(fromId).data.geometry.coordinates;
            const toCoord = locations.getLocation(toId).data.geometry.coordinates;
            console.debug(`Fly from ${fromId} ${fromCoord} to ${toId} ${toCoord}`);
            if ($cda4673139222688$var$route) $cda4673139222688$var$route.fly(fromCoord, toCoord, 2000);
        }
    }
    const commentary = new (0, $5xtjF.Commentary)({
        callback: function(oldId, newId) {
            var hideIds = [
                oldId
            ];
            const oldAdditional = document.getElementById(oldId).getAttribute("additionalLocations");
            if (oldAdditional) hideIds = hideIds.concat(oldAdditional.split(" "));
            var showIds = [
                newId
            ];
            const newAdditional = document.getElementById(newId).getAttribute("additionalLocations");
            if (newAdditional) showIds = showIds.concat(newAdditional.split(" "));
            console.debug(`hideIds = ${hideIds}`);
            for (const id of hideIds)locations.getLocation(id).popupVisible = false;
            console.debug(`showIds = ${showIds}`);
            for (const id of showIds)locations.getLocation(id).popupVisible = true;
            fly(oldId, newId);
        }
    });
    commentary.setIndex(0);
    return map;
}


export {$cda4673139222688$export$d49c9aa30b771d59 as createMap};
//# sourceMappingURL=heritage_trail.js.map
