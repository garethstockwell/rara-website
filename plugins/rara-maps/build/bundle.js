/*! Built from commit: 3df8992 */
/******/ var __webpack_modules__ = ({

/***/ "./src/component/commentary.js":
/*!*************************************!*\
  !*** ./src/component/commentary.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Commentary: () => (/* binding */ Commentary)
/* harmony export */ });
// Commentary component

class Commentary {
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
	 * @param {Function} args.callback Callback function
	 */
	constructor( args ) {
		this.#elems = document.querySelectorAll( '.commentary' );
		this.#elems.forEach( ( el ) => ( el.style = 'display: none;' ) );
		this.#elemIds = Array.from( this.#elems ).map( ( el ) => el.id );

		this.#index = 0;
		this.#activeId = this.#elemIds[ this.#index ];

		this.#prevButtons = document.querySelectorAll( '.prev-button' );
		this.#prevLabels = document.querySelectorAll( '.prev-label' );
		this.#nextButtons = document.querySelectorAll( '.next-button' );
		this.#nextLabels = document.querySelectorAll( '.next-label' );

		this.#prevButtons.forEach( ( el ) =>
			el.addEventListener( 'click', ( {} ) => this.#onPrev() )
		);
		this.#nextButtons.forEach( ( el ) =>
			el.addEventListener( 'click', ( {} ) => this.#onNext() )
		);

		this.#callback = args.callback;
	}

	/**
	 * Get commentary identifiers
	 */
	get ids() {
		return this.#elemIds;
	}

	/**
	 * Set active identifier
	 * @param {number} index Index of identifier
	 */
	setIndex( index ) {
		const oldId = this.#activeId;
		this.#index = index;
		this.#activeId = this.#elemIds[ this.#index ];

		console.debug(
			`Commentary.setIndex ${ oldId } -> ${ index } ${ this.#activeId }`
		);

		const oldElem = document.querySelector( '#' + oldId );
		oldElem.style.display = 'none';

		const newElem = document.querySelector( '#' + this.#activeId );
		newElem.style.display = 'block';

		if ( this.#index > 0 ) {
			this.#prevButtons.forEach(
				( el ) => ( el.style.visibility = 'visible' )
			);
			this.#prevLabels.forEach(
				( el ) =>
					( el.textContent = document
						.querySelector( '#' + this.#elemIds[ this.#index - 1 ] )
						.querySelector( 'h1' ).textContent )
			);
		} else {
			this.#prevButtons.forEach(
				( el ) => ( el.style.visibility = 'hidden' )
			);
		}

		if ( this.#index + 1 < this.#elemIds.length ) {
			this.#nextButtons.forEach(
				( el ) => ( el.style.visibility = 'visible' )
			);
			this.#nextLabels.forEach(
				( el ) =>
					( el.textContent = document
						.querySelector( '#' + this.#elemIds[ this.#index + 1 ] )
						.querySelector( 'h1' ).textContent )
			);
		} else {
			this.#nextButtons.forEach(
				( el ) => ( el.style.visibility = 'hidden' )
			);
		}

		if ( this.#callback ) {
			this.#callback( oldId, this.#activeId );
		}
	}

	#onPrev() {
		this.setIndex(
			( this.#index - 1 + this.#elemIds.length ) % this.#elemIds.length
		);
	}

	#onNext() {
		this.setIndex( ( this.#index + 1 ) % this.#elemIds.length );
	}
}


/***/ }),

/***/ "./src/component/layer.js":
/*!********************************!*\
  !*** ./src/component/layer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayerManager: () => (/* binding */ LayerManager)
/* harmony export */ });
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
	constructor( map, order ) {
		this.#order = order;

		map.on( 'load', () => {
			map.addSource( 'empty', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] },
			} );

			for ( let i = this.#order.length - 1; i >= 0; i-- ) {
				map.addLayer(
					{
						id: `z-${ i }`,
						type: 'symbol',
						source: 'empty',
					},
					i === this.#order.length - 1 ? undefined : `z-${ i + 1 }`
				);
			}
		} );
	}

	/**
	 * Get index of layer
	 * @param {string} layerId
	 * @return Index of layer
	 */
	getPosition( layerId ) {
		if ( ! this.#order.includes( layerId ) ) {
			throw new Error(
				`Layer ${ layerId } not included as a sortable layer`
			);
		}

		return `z-${ this.#order.indexOf( layerId ) }`;
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
	constructor( manager, id, visible, callback ) {
		console.debug( `Layer.create id=${ id } visible=${ visible }` );
		this.#id = id;
		this.#manager = manager;
		this.#visible = visible;
		this.#callback = callback;
	}

	set visible( visible ) {
		console.debug(
			`Layer.setVisible id=${ this.#id } visible=${ visible }`
		);
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
			`Layer.onLoaded id=${ this.#id } visible=${
				this.visible
			} callback=${ this.#callback }`
		);
		this.#onVisibleChange();
		if ( this.#callback ) {
			this.#callback( this.#id );
		}
	}

	/**
	 * Toggle visibility
	 * @return {boolean} Updated visibility
	 */
	toggleVisible() {
		console.debug(
			`Layer.toggleVisible id=${ this.#id } visible=${ this.visible }`
		);

		this.visible =
			this.#manager.map.getLayoutProperty( this.#id, 'visibility' ) !==
			'visible';

		return this.visible;
	}

	#onVisibleChange() {
		console.debug(
			`Layer.onVisibleChange id=${ this.#id } visible=${ this.visible }`
		);
		this.#manager.map.setLayoutProperty(
			this.#id,
			'visibility',
			this.visible ? 'visible' : 'none'
		);
	}
}

/**
 * Manager of a stack of layers
 */
class LayerManager {
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
	constructor( args ) {
		this.#layers = {};
		this.#map = args.map;
		this.#menu = args.menu;
		this.#zOrder = new ZOrder( args.map, args.zOrder );
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
	getLayer( id ) {
		return this.#layers[ id ];
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
	addLayer( func, args ) {
		args.visible = args.visible ?? true;
		const layer = this.#addLayer( args.id, args.visible, args.callback );

		args.callback = ( id ) => {
			layer.onLoaded( id );
		};
		args.zOrder = this.#zOrder;
		func( this.#map, args );

		const addToMenu = args.addToMenu ?? true;
		if ( addToMenu ) {
			this.#menu.addItem( {
				id: args.id,
				text: args.text,
				onclick: () => {
					return layer.toggleVisible();
				},
				active: args.visible,
				color: args.color,
			} );
		}
	}

	#addLayer( id, visible, callback ) {
		const layer = new Layer( this, id, visible, callback );
		this.#layers[ id ] = layer;
		return layer;
	}
}


/***/ }),

/***/ "./src/component/location.js":
/*!***********************************!*\
  !*** ./src/component/location.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocationManager: () => (/* binding */ LocationManager)
/* harmony export */ });
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
	constructor( manager, id ) {
		console.debug( `Location.create id=${ id }` );
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

	set popupVisible( visible ) {
		console.debug(
			`Location.setPopupVisible id=${ this.#id } visible=${ visible }`
		);
		this.#popupVisible = visible;
		this.#onPopupVisibleChange();
	}

	setData( data ) {
		console.debug( `Location.setData id=${ this.#id } data=${ data }` );
		this.#data = data;
		this.#popup = new maplibregl.Popup( {
			closeButton: false,
			closeOnClick: false,
		} );

		this.#popup
			.setLngLat( data.geometry.coordinates )
			.setHTML( data.properties.title )
			.addTo( this.#manager.map );

		this.#onPopupVisibleChange();
	}

	#onPopupVisibleChange() {
		console.debug(
			`Location.onPopupVisibleChange id=${ this.#id } visible=${
				this.popupVisible
			} popup=${ this.#popup }`
		);
		if ( this.#popup ) {
			this.#popup.getElement().style.visibility = this.popupVisible
				? 'visible'
				: 'hidden';
		}
	}
}

/**
 * Manager of a set of locations
 */
class LocationManager {
	#locations;
	#map;

	/**
	 * Create a LocationManager
	 * @param {Object}         args     The arguments
	 * @param {maplibregl.Map} args.map The map
	 */
	constructor( args ) {
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
	getLocation( id ) {
		if ( ! ( id in this.#locations ) ) {
			this.#addLocation( id );
		}
		return this.#locations[ id ];
	}

	#addLocation( id ) {
		console.debug( 'LocationManager.addLocation', id );
		const popup = new Location( this, id );
		this.#locations[ id ] = popup;
		return popup;
	}
}


/***/ }),

/***/ "./src/component/map.js":
/*!******************************!*\
  !*** ./src/component/map.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Map: () => (/* binding */ Map)
/* harmony export */ });
/* harmony import */ var _component_layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/layer.js */ "./src/component/layer.js");
/* harmony import */ var _component_menu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/menu.js */ "./src/component/menu.js");
/* harmony import */ var _component_location_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/location.js */ "./src/component/location.js");
// Map component





function addNavigationControl( map ) {
	map.addControl(
		new maplibregl.NavigationControl( {
			visualizePitch: true,
			visualizeRoll: true,
			showZoom: true,
			showCompass: true,
		} )
	);

	map.addControl( new maplibregl.FullscreenControl() );

	map.addControl( new maplibregl.ScaleControl(), 'bottom-right' );
}

/**
 * Create a Map
 * @param {Object}        args        The arguments
 * @param {Object}        args.config Map configuration
 * @param {Array<string>} args.zOrder List of layer IDs, lowest to highest
 */
function Map( args ) {
	console.debug( 'Map', args );

	const map = new maplibregl.Map( args.config );

	const menu = new _component_menu_js__WEBPACK_IMPORTED_MODULE_1__.Menu();

	const layerManager = new _component_layer_js__WEBPACK_IMPORTED_MODULE_0__.LayerManager( {
		map,
		menu,
		zOrder: args.zOrder ?? [],
	} );

	const locationManager = new _component_location_js__WEBPACK_IMPORTED_MODULE_2__.LocationManager( {
		map,
	} );

	map.appData = {
		layers: layerManager,
		locations: locationManager,
	};

	addNavigationControl( map );

	return map;
}


/***/ }),

/***/ "./src/component/menu.js":
/*!*******************************!*\
  !*** ./src/component/menu.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Menu: () => (/* binding */ Menu)
/* harmony export */ });
// Menu component

class Menu {
	#elem;

	/**
	 * Create a Menu
	 */
	constructor() {
		this.#elem = document.getElementById( 'menu' );

		if ( this.#elem ) {
			const handleKeyDown = ( e ) => {
				if ( e.key === 'm' ) {
					this.#toggleVisible();
				}
			};

			document.addEventListener( 'keydown', handleKeyDown, true );
		}
	}

	/**
	 * Add a menu item
	 * @param {Object}   args         The arguments
	 * @param {string}   args.id      Layer identifier
	 * @param {string}   args.text    Text
	 * @param {Function} args.onclick Click handler
	 * @param {boolean}  args.active  Whether item is active
	 * @param {string}   args.color   Item color
	 */
	addItem( args ) {
		if ( this.#elem ) {
			const link = document.createElement( 'a' );
			link.id = `menu_${ args.id }`;
			link.layerId = args.id;
			link.href = '#';
			link.textContent = args.text;
			link.className = args.active ? 'active' : '';
			link.onclick = ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				link.className = args.onclick() ? 'active' : '';
			};

			const box = document.createElement( 'div' );
			box.className = 'box';
			box.style.backgroundColor = args.color ?? 'transparent';
			link.appendChild( box );

			this.#elem.appendChild( link );
			this.#show();
		}
	}

	#show() {
		this.#elem.hidden = false;
	}

	#toggleVisible() {
		console.debug( 'Menu.toggleVisible' );
		this.#elem.hidden = ! this.#elem.hidden;
	}
}


/***/ }),

/***/ "./src/component/route.js":
/*!********************************!*\
  !*** ./src/component/route.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Route: () => (/* binding */ Route)
/* harmony export */ });
// Component which allows camera to fly along a route

class Route {
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
	 */
	constructor( args ) {
		this.#camera = {
			coord: null,
			altitude: args.altitude ?? 500,
			distance: null,
		};
		this.#distance = args.distance ?? 500;
		this.#map = args.map;
		this.#speed = 0.0001;

		this.#init( args.lineId, args.autoStart ?? false );
	}

	#init( lineId, autoStart ) {
		const line = this.#map.getSource( lineId );
		line.getData().then( ( data ) => {
			console.debug( 'Route loaded' );

			const coordinates = data.features[ 0 ].geometry.coordinates;
			this.#route = turf.lineString( coordinates );

			// calculate camera startpoint
			//  - compute the direction of the first quater of the route
			//  - and place the camera in to opposite direction of this point
			const a = maplibregl.MercatorCoordinate.fromLngLat(
				coordinates[ 0 ]
			);
			const b = maplibregl.MercatorCoordinate.fromLngLat(
				turf.along( this.#route, turf.lineDistance( this.#route ) / 4 )
					.geometry.coordinates
			);
			const dx = b.x - a.x,
				dy = b.y - a.y;
			this.#camera.distance = this.#distance ?? Math.hypot( dx, dy );
			this.#camera.coord = new maplibregl.MercatorCoordinate(
				a.x - dx,
				a.y - dy
			);

			// FIXME! when using flyTo the positioning is not correct
			this.#map.jumpTo(
				this.#map.calculateCameraOptionsFromTo(
					this.#camera.coord.toLngLat(),
					this.#camera.altitude,
					coordinates[ 0 ]
				)
			);

			if ( autoStart ) {
				console.debug( 'Automatically starting' );
				this.#start();
			}
		} );
	}

	#start() {
		console.debug( 'Route.start' );

		this.#startDistance = 0;
		this.#stopDistance = null;
		this.#reachedStopDistance = false;
		this.#direction = 1;

		if ( this.#startCoord ) {
			console.debug( 'Start coordinates:', this.#startCoord );
			const startPoint = turf.point( this.#startCoord );
			const snappedStartPoint = turf.nearestPointOnLine(
				this.#route,
				startPoint
			);
			this.#startDistance = snappedStartPoint.properties.location;
			console.debug( 'Start distance (km):', this.#startDistance );
		}

		if ( this.#stopCoord ) {
			console.debug( 'Stop coordinates:', this.#stopCoord );
			const stopPoint = turf.point( this.#stopCoord );
			const snappedStopPoint = turf.nearestPointOnLine(
				this.#route,
				stopPoint
			);
			this.#stopDistance = snappedStopPoint.properties.location;
			console.debug( 'Stop distance (km):', this.#stopDistance );
		}

		if ( this.#stopDistance && this.#stopDistance < this.#startDistance ) {
			this.#direction = -1;
		}

		this.#startTime = Date.now();

		this.#advance();
	}

	#advance() {
		if ( this.#reachedStopDistance ) {
			return;
		}

		const now = Date.now();

		const elapsedTime = now - this.#startTime;
		let currentDistance =
			this.#startDistance + elapsedTime * this.#speed * this.#direction;

		if ( ! this.#stopDistance ) {
			const totalDistance = turf.lineDistance( this.#route );
			currentDistance = currentDistance % totalDistance;
		}

		//console.debug('advance currentDistance=', currentDistance, 'stopDistance=', stopDistance);

		const lngLat = turf.along( this.#route, currentDistance ).geometry
			.coordinates;
		this.#map
			.getSource( 'point' )
			.setData( { type: 'Point', coordinates: lngLat } );

		// Let the camera follow the route
		const coord = maplibregl.MercatorCoordinate.fromLngLat( lngLat );
		const dx = coord.x - this.#camera.coord.x,
			dy = coord.y - this.#camera.coord.y;
		const delta = Math.hypot( dx, dy ) - this.#camera.distance;
		if ( delta > 0 ) {
			const a = Math.atan2( dy, dx );
			this.#camera.coord.x += Math.cos( a ) * delta;
			this.#camera.coord.y += Math.sin( a ) * delta;
		}
		// FIXME! when using easeTo the positioning is not correct
		this.#map.jumpTo(
			this.#map.calculateCameraOptionsFromTo(
				this.#camera.coord.toLngLat(),
				this.#camera.altitude,
				lngLat
			)
		);

		// Determine whether stop point has been reached
		if (
			this.#stopDistance !== null &&
			( ( this.#direction > 0 &&
				currentDistance >= this.#stopDistance ) ||
				( this.#direction < 0 &&
					currentDistance <= this.#stopDistance ) )
		) {
			this.#reachedStopDistance = true;
			console.debug( 'Stopped at distance:', this.#stopDistance );
			return;
		}

		requestAnimationFrame( () => {
			this.#advance();
		} );
	}

	/**
	 * Fly from start position to stop position
	 * @param {[float, float]} startPos Start position, expressed as [lat, lng]
	 * @param {[float, float]} stopPos  Stop position, expressed as [lat, lng]
	 */
	fly( startPos, stopPos ) {
		console.debug( 'Fly from', startPos, 'to', stopPos );

		this.#startCoord = startPos;
		this.#stopCoord = stopPos;

		this.#reachedStopDistance = false;

		if ( this.#route ) {
			this.#start();
		}
	}
}


/***/ }),

/***/ "./src/control/attribution.js":
/*!************************************!*\
  !*** ./src/control/attribution.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addAttribution: () => (/* binding */ addAttribution)
/* harmony export */ });
// Attributions

const attributions = [];
let attributionControl = null;

const position = 'bottom-left';

function addAttribution( map, attribution ) {
	if ( ! attributions.includes( attribution ) ) {
		attributions.push( attribution );
	}

	if ( attributionControl ) {
		map.removeControl( attributionControl );
	}

	attributionControl = new maplibregl.AttributionControl( {
		compact: true,
		customAttribution: `<br>${ attributions.join( '<br>' ) }`,
	} );

	map.addControl( attributionControl, position );

	// Collapse the control
	const controlElem = document.getElementsByClassName(
		`maplibregl-ctrl-${ position }`
	)[ 0 ];
	const containerElem = controlElem.getElementsByTagName( 'details' )[ 0 ];
	containerElem.classList.remove( 'maplibregl-compact-show' );
	containerElem.removeAttribute( 'open' );
}


/***/ }),

/***/ "./src/layer/buildings.js":
/*!********************************!*\
  !*** ./src/layer/buildings.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addBuildingsLayer: () => (/* binding */ addBuildingsLayer)
/* harmony export */ });
// Add 3D buildings

function addBuildingsLayer( map, options ) {
	const id = options.id;

	map.on( 'load', () => {
		// Insert the layer beneath any symbol layer.
		const layers = map.getStyle().layers;

		let labelLayerId;
		for ( let i = 0; i < layers.length; i++ ) {
			if (
				layers[ i ].type === 'symbol' &&
				'layout' in layers[ i ] &&
				layers[ i ].layout[ 'text-field' ]
			) {
				labelLayerId = layers[ i ].id;
				break;
			}
		}

		map.addSource( id, {
			url: `https://tiles.openfreemap.org/planet`,
			type: 'vector',
		} );

		map.addLayer(
			{
				id,
				source: id,
				'source-layer': 'building',
				type: 'fill-extrusion',
				minzoom: 15,
				filter: [ '!=', [ 'get', 'hide_3d' ], true ],
				layout: {
					visibility: options.visible ? 'visible' : 'none',
				},
				paint: {
					'fill-extrusion-color': [
						'interpolate',
						[ 'linear' ],
						[ 'get', 'render_height' ],
						0,
						'lightgray',
						200,
						'royalblue',
						400,
						'lightblue',
					],
					'fill-extrusion-height': [
						'interpolate',
						[ 'linear' ],
						[ 'zoom' ],
						15,
						0,
						16,
						[ 'get', 'render_height' ],
					],
					'fill-extrusion-base': [
						'case',
						[ '>=', [ 'get', 'zoom' ], 16 ],
						[ 'get', 'render_min_height' ],
						0,
					],
				},
			},
			labelLayerId
		);

		if ( options.callback ) {
			options.callback( [ 'buildings', id ] );
		}
	} );
}


/***/ }),

/***/ "./src/layer/line.js":
/*!***************************!*\
  !*** ./src/layer/line.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addLineLayer: () => (/* binding */ addLineLayer)
/* harmony export */ });
// Add a map layer which shows a line

function addLineLayer( map, options ) {
	const id = options.id;

	map.on( 'load', () => {
		fetch( options.url )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				map.addSource( id, {
					type: 'geojson',
					data,
				} );

				map.addLayer(
					{
						id,
						type: 'line',
						source: id,
						layout: {
							'line-join': 'round',
							'line-cap': 'round',
							visibility: options.visible ? 'visible' : 'none',
						},
						paint: {
							'line-color': options.color,
							'line-width': 6,
						},
					},
					options.zOrder ? options.zOrder.getPosition( id ) : null
				);

				if ( options.callback ) {
					options.callback( [ 'line', id ] );
				}
			} );
	} );
}


/***/ }),

/***/ "./src/layer/locations.js":
/*!********************************!*\
  !*** ./src/layer/locations.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addLocationsLayer: () => (/* binding */ addLocationsLayer)
/* harmony export */ });
// Add a map layer which shows locations

/**
 * Create the map
 * @param          map
 * @param {Object} args The arguments
 */
function addLocationsLayer( map, args ) {
	map.on( 'load', async () => {
		const id = args.id;

		const locations = map.appData.locations;

		const image = await map.loadImage(
			`/public/assets/icons/pin-${ args.color }.png`
		);
		map.addImage( id, image.data );

		fetch( args.url )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				if ( args.tags ) {
					data.features = data.features.filter( ( feature ) =>
						args.tags.every( ( x ) =>
							feature.properties.tags.includes( x )
						)
					);
				}

				data.features.forEach( ( feature ) => {
					const loc = locations.getLocation( feature.properties.id );
					loc.setData( feature );
					if ( args.staticPopups ) {
						loc.popupVisible = true;
					}
				} );

				map.addSource( id, {
					type: 'geojson',
					data,
				} );

				map.addLayer(
					{
						id,
						type: 'symbol',
						source: id,
						layout: {
							'icon-image': id,
							'icon-size': 1.0,
							'icon-allow-overlap': true,
							visibility: args.visible ? 'visible' : 'none',
						},
					},
					args.zOrder ? args.zOrder.getPosition( id ) : null
				);

				if ( ! args.staticPopups ) {
					// Make sure to detect marker change for overlapping markers
					// and use mousemove instead of mouseenter event
					let currentFeatureId;
					let currentFeatureCoordinates;
					map.on( 'mousemove', id, ( e ) => {
						const featureCoordinates =
							e.features[ 0 ].geometry.coordinates.toString();
						if (
							currentFeatureCoordinates !== featureCoordinates
						) {
							currentFeatureCoordinates = featureCoordinates;

							// Change the cursor style as a UI indicator.
							map.getCanvas().style.cursor = 'pointer';

							const coordinates =
								e.features[ 0 ].geometry.coordinates.slice();

							// Ensure that if the map is zoomed out such that multiple
							// copies of the feature are visible, the popup appears
							// over the copy being pointed to.
							while (
								Math.abs( e.lngLat.lng - coordinates[ 0 ] ) >
								180
							) {
								coordinates[ 0 ] +=
									e.lngLat.lng > coordinates[ 0 ]
										? 360
										: -360;
							}

							if ( currentFeatureId ) {
								locations.getLocation(
									currentFeatureId
								).popupVisible = false;
							}

							currentFeatureId = e.features[ 0 ].properties.id;
							locations.getLocation(
								currentFeatureId
							).popupVisible = true;

							if ( args.onenter ) {
								args.onenter( currentFeatureId );
							}
						}
					} );

					map.on( 'mouseleave', id, () => {
						const featureId = currentFeatureId;

						/*
            map.getCanvas().style.cursor = '';
            locations.getLocation(currentFeatureId).popupVisible = false;
            currentFeatureId = undefined;
            currentFeatureCoordinates = undefined;
            */

						if ( args.onleave ) {
							args.onleave( featureId );
						}
					} );
				}

				if ( args.onclick ) {
					map.on( 'click', id, ( e ) => {
						args.onclick( e.features[ 0 ].properties.id );
					} );
				}
			} );
	} );
}


/***/ }),

/***/ "./src/layer/overlay.js":
/*!******************************!*\
  !*** ./src/layer/overlay.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addOverlayLayer: () => (/* binding */ addOverlayLayer)
/* harmony export */ });
/* harmony import */ var _control_attribution_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control/attribution.js */ "./src/control/attribution.js");
/* harmony import */ var _util_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/url.js */ "./src/util/url.js");
// Add a map layer which shows an image





function addOverlayLayer( map, options ) {
	const id = options.id;

	map.on( 'load', () => {
		fetch( (0,_util_url_js__WEBPACK_IMPORTED_MODULE_1__.absUrl)( '%{PLUGIN}/public/assets/data/overlays.json' ) )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				const entry = data.overlays.features.find(
					( item ) => item.properties.id === id
				);

				// Add image source
				map.addSource( id, {
					type: 'image',
					url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_1__.absUrl)( entry.properties.url ),
					coordinates: entry.geometry.coordinates,
				} );

				// Add raster layer using that source
				map.addLayer(
					{
						id,
						type: 'raster',
						source: id,
						paint: {
							'raster-opacity': options.opacity ?? 1.0,
						},
						layout: {
							visibility: options.visible ? 'visible' : 'none',
						},
					},
					options.zOrder ? options.zOrder.getPosition( id ) : null
				);

				if ( entry.properties.attribution ) {
					const attrib =
						data.attributions[ entry.properties.attribution ];
					if ( attrib ) {
						(0,_control_attribution_js__WEBPACK_IMPORTED_MODULE_0__.addAttribution)( map, attrib );
					}
				}

				if ( options.callback ) {
					options.callback( [ 'overlay', id ] );
				}
			} );
	} );
}


/***/ }),

/***/ "./src/map/boundary_radius.js":
/*!************************************!*\
  !*** ./src/map/boundary_radius.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMap: () => (/* binding */ createMap)
/* harmony export */ });
/* harmony import */ var _component_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/map.js */ "./src/component/map.js");
/* harmony import */ var _layer_buildings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layer/buildings.js */ "./src/layer/buildings.js");
/* harmony import */ var _layer_line_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layer/line.js */ "./src/layer/line.js");
/* harmony import */ var _layer_locations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layer/locations.js */ "./src/layer/locations.js");
/* harmony import */ var _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../layer/overlay.js */ "./src/layer/overlay.js");
/* harmony import */ var _util_url_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/url.js */ "./src/util/url.js");
// Fly around the boundary, with camera pointing to the centre










/**
 * Create the map
 * @return Map
 */
function createMap() {
	const config = {
		style: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [
		'camantsoc_1836_1838',
		'camantsoc_1910',
		'camantsoc_1925',
		'barnwell_priory',
		'boundary',
		'heritage_trail',
		'attractions',
		'improvements',
	];

	const map = new _component_map_js__WEBPACK_IMPORTED_MODULE_0__.Map( {
		config,
		zOrder,
	} );

	let start = null;
	const playtime = 30000;
	let route = null;

	const center = new maplibregl.LngLat(
		0.14547600132800653,
		52.212610097321885
	);
	const centerPt = turf.point( [ center.lng, center.lat ] );

	const altitude = 300; // m
	const extend = 500; // m

	const animate = () => {
		start = start || Date.now();
		const progress = ( Date.now() - start ) % playtime;
		const boundaryPt = turf.along(
			route,
			( turf.lineDistance( route ) * progress ) / playtime
		).geometry.coordinates;

		// Compute distance (in km) and bearing between them
		const dist = turf.distance( centerPt, boundaryPt, { units: 'meters' } );
		const bearing = turf.bearing( centerPt, boundaryPt );

		// Extend the line
		const extendedDist = dist + extend;

		// Compute the new point 200 m beyond 'boundary' along the same bearing
		const extendedPt = turf.destination( centerPt, extendedDist, bearing, {
			units: 'meters',
		} );

		// Extract as [lng, lat]
		const extendedLngLat = extendedPt.geometry.coordinates;

		map.jumpTo(
			map.calculateCameraOptionsFromTo(
				new maplibregl.LngLat(
					extendedLngLat[ 0 ],
					extendedLngLat[ 1 ]
				),
				altitude,
				center
			)
		);

		requestAnimationFrame( animate );
	};

	map.on( 'load', async () => {
		fetch(
			(0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/line_boundary_smooth.json' )
		)
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				const coordinates = data.features[ 0 ].geometry.coordinates;
				route = turf.lineString( coordinates );
				animate();
			} );
	} );

	map.appData.layers.addLayer( _layer_buildings_js__WEBPACK_IMPORTED_MODULE_1__.addBuildingsLayer, {
		id: '3d_buildings',
		text: '3D buildings',
		color: '#aaaaaa',
		visible: true,
	} );

	map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_2__.addLineLayer, {
		id: 'boundary',
		text: 'Riverside area boundary',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/line_boundary.json' ),
		color: 'black',
		visible: true,
	} );

	map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_2__.addLineLayer, {
		id: 'heritage_trail',
		text: 'Heritage trail line',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/line_heritage_trail.json' ),
		color: 'green',
		visible: false,
	} );

	map.appData.layers.addLayer( _layer_locations_js__WEBPACK_IMPORTED_MODULE_3__.addLocationsLayer, {
		id: 'attractions',
		text: 'Attractions',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'yellow',
		visible: true,
		staticPopups: true,
	} );

	map.appData.layers.addLayer( _layer_locations_js__WEBPACK_IMPORTED_MODULE_3__.addLocationsLayer, {
		id: 'improvements',
		text: 'Improvements',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/locations.json' ),
		tags: [ 'improvements' ],
		color: 'red',
		visible: true,
		staticPopups: true,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
		id: 'barnwell_priory',
		text: 'Barnwell Priory (historical)',
		color: 'orange',
		visible: false,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
		id: 'camantsoc_1836_1838',
		text: 'Map circa 1836-1838',
		opacity: 1.0,
		visible: false,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
		id: 'camantsoc_1910',
		text: 'Map circa 1910',
		opacity: 1.0,
		visible: false,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
		id: 'camantsoc_1925',
		text: 'Map circa 1925',
		opacity: 1.0,
		visible: false,
	} );

	return map;
}


/***/ }),

/***/ "./src/map/heritage_trail.js":
/*!***********************************!*\
  !*** ./src/map/heritage_trail.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMap: () => (/* binding */ createMap)
/* harmony export */ });
/* harmony import */ var _component_commentary_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/commentary.js */ "./src/component/commentary.js");
/* harmony import */ var _component_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/map.js */ "./src/component/map.js");
/* harmony import */ var _component_route_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/route.js */ "./src/component/route.js");
/* harmony import */ var _layer_buildings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layer/buildings.js */ "./src/layer/buildings.js");
/* harmony import */ var _layer_line_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../layer/line.js */ "./src/layer/line.js");
/* harmony import */ var _layer_locations_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../layer/locations.js */ "./src/layer/locations.js");
/* harmony import */ var _util_url_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/url.js */ "./src/util/url.js");
// Render a map of the heritage trail











let route = null;

/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
function createMap( args ) {
	args = args ?? {};

	const config = {
		style: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_6__.absUrl)( '%{PLUGIN}/public/assets/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [ 'boundary', 'heritage_trail', 'locations', 'point' ];

	const map = new _component_map_js__WEBPACK_IMPORTED_MODULE_1__.Map( {
		config,
		zOrder,
	} );

	const locations = map.appData.locations;

	map.on( 'load', () => {
		map.addSource( 'point', {
			type: 'geojson',
			data: {
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Point',
					coordinates: [ 0.0, 0.0 ],
				},
			},
		} );

		map.addLayer(
			{
				id: 'point',
				source: 'point',
				type: 'circle',
				paint: {
					'circle-radius': 10,
					'circle-color': '#ff0000',
					'circle-stroke-width': 2,
					'circle-stroke-color': 'white',
				},
			},
			map.appData.layers.zOrder.getPosition( 'point' )
		);
	} );

	map.appData.layers.addLayer( _layer_buildings_js__WEBPACK_IMPORTED_MODULE_3__.addBuildingsLayer, {
		id: '3d_buildings',
		text: '3D buildings',
		color: '#aaaaaa',
		visible: true,
	} );

	map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_4__.addLineLayer, {
		id: 'boundary',
		text: 'Riverside area boundary',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_6__.absUrl)( '%{PLUGIN}/public/assets/data/line_boundary.json' ),
		color: 'black',
		visible: false,
	} );

	map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_4__.addLineLayer, {
		id: 'heritage_trail',
		text: 'Heritage trail line',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_6__.absUrl)( '%{PLUGIN}/public/assets/data/line_heritage_trail.json' ),
		color: 'green',
		callback: ( {} ) => {
			route = new _component_route_js__WEBPACK_IMPORTED_MODULE_2__.Route( {
				altitude: 200,
				distance: 500,
				lineId: 'heritage_trail',
				map,
			} );
		},
		visible: true,
	} );

	map.appData.layers.addLayer( _layer_locations_js__WEBPACK_IMPORTED_MODULE_5__.addLocationsLayer, {
		id: 'locations',
		text: 'Heritage trail locations',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_6__.absUrl)( '%{PLUGIN}/public/assets/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'green',
		onclick: args.locationOnClick ?? null,
		visible: true,
	} );

	/**
	 * Fly from source location to destination location
	 * @param {string} fromId Source location identifier
	 * @param {string} toId   Destination location identifier
	 */
	function fly( fromId, toId ) {
		console.debug( `Fly from ${ fromId } to ${ toId }` );
		if ( fromId !== toId ) {
			const fromCoord =
				locations.getLocation( fromId ).data.geometry.coordinates;
			const toCoord =
				locations.getLocation( toId ).data.geometry.coordinates;
			console.debug(
				`Fly from ${ fromId } ${ fromCoord } to ${ toId } ${ toCoord }`
			);
			if ( route ) {
				route.fly( fromCoord, toCoord, 2000 );
			}
		}
	}

	const commentary = new _component_commentary_js__WEBPACK_IMPORTED_MODULE_0__.Commentary( {
		callback( oldId, newId ) {
			let hideIds = [ oldId ];
			const oldAdditional = document
				.getElementById( oldId )
				.getAttribute( 'additionalLocations' );
			if ( oldAdditional ) {
				hideIds = hideIds.concat( oldAdditional.split( ' ' ) );
			}

			let showIds = [ newId ];
			const newAdditional = document
				.getElementById( newId )
				.getAttribute( 'additionalLocations' );
			if ( newAdditional ) {
				showIds = showIds.concat( newAdditional.split( ' ' ) );
			}

			console.debug( `hideIds = ${ hideIds }` );
			for ( const id of hideIds ) {
				locations.getLocation( id ).popupVisible = false;
			}

			console.debug( `showIds = ${ showIds }` );
			for ( const id of showIds ) {
				locations.getLocation( id ).popupVisible = true;
			}

			fly( oldId, newId );
		},
	} );

	commentary.setIndex( 0 );

	return map;
}


/***/ }),

/***/ "./src/map/history.js":
/*!****************************!*\
  !*** ./src/map/history.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMap: () => (/* binding */ createMap)
/* harmony export */ });
/* harmony import */ var _component_commentary_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/commentary.js */ "./src/component/commentary.js");
/* harmony import */ var _component_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/map.js */ "./src/component/map.js");
/* harmony import */ var _layer_line_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layer/line.js */ "./src/layer/line.js");
/* harmony import */ var _layer_overlay_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layer/overlay.js */ "./src/layer/overlay.js");
/* harmony import */ var _util_url_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/url.js */ "./src/util/url.js");
// Render history view









/**
 * Create the map
 * @return Map
 */
function createMap() {
	const config = {
		style: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_4__.absUrl)( '%{PLUGIN}/public/assets/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [
		'camantsoc_1836_1838',
		'camantsoc_1910',
		'camantsoc_1925',
		'boundary',
	];

	const map = new _component_map_js__WEBPACK_IMPORTED_MODULE_1__.Map( {
		config,
		zOrder,
	} );

	map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_2__.addLineLayer, {
		id: 'boundary',
		text: 'Riverside area boundary',
		url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_4__.absUrl)( '%{PLUGIN}/public/assets/data/line_boundary.json' ),
		color: 'black',
		visible: true,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_3__.addOverlayLayer, {
		id: 'camantsoc_1836_1838',
		text: 'Map circa 1836-1838',
		opacity: 1.0,
		visible: false,
		addToMenu: false,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_3__.addOverlayLayer, {
		id: 'camantsoc_1910',
		text: 'Map circa 1910',
		opacity: 1.0,
		visible: false,
		addToMenu: false,
	} );

	map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_3__.addOverlayLayer, {
		id: 'camantsoc_1925',
		text: 'Map circa 1925',
		opacity: 1.0,
		visible: false,
		addToMenu: false,
	} );

	setUpCommentary( map );

	return map;
}

/**
 * Link commentary panel to map
 * @param map
 */
function setUpCommentary( map ) {
	// Map from era to layer
	const eraToLayer = {
		c_1836_1838: 'camantsoc_1836_1838',
		c_1910: 'camantsoc_1910',
		c_1925: 'camantsoc_1925',
	};

	const commentary = new _component_commentary_js__WEBPACK_IMPORTED_MODULE_0__.Commentary( {
		callback( oldId, newId ) {
			console.debug( `history.onUpdate id ${ oldId } -> ${ newId }` );

			const oldLayer = eraToLayer[ oldId ];
			const newLayer = eraToLayer[ newId ];

			console.debug(
				`history.onUpdate layer ${ oldLayer } -> ${ newLayer }`
			);

			map.appData.layers.getLayer( oldLayer ).visible = false;
			map.appData.layers.getLayer( newLayer ).visible = true;
		},
	} );

	function loaded( e ) {
		const layerId = eraToLayer[ commentary.ids[ 0 ] ];
		if ( e.isSourceLoaded && e.sourceId === layerId ) {
			console.debug( `Source ${ e.sourceId } is loaded` );
			commentary.setIndex( 0 );
			map.off( 'sourcedata', loaded );
		}
	}

	map.on( 'sourcedata', loaded );
}


/***/ }),

/***/ "./src/map/vector.js":
/*!***************************!*\
  !*** ./src/map/vector.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMap: () => (/* binding */ createMap)
/* harmony export */ });
/* harmony import */ var _component_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/map.js */ "./src/component/map.js");
/* harmony import */ var _layer_buildings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layer/buildings.js */ "./src/layer/buildings.js");
/* harmony import */ var _layer_line_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layer/line.js */ "./src/layer/line.js");
/* harmony import */ var _layer_locations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layer/locations.js */ "./src/layer/locations.js");
/* harmony import */ var _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../layer/overlay.js */ "./src/layer/overlay.js");
/* harmony import */ var _util_url_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/url.js */ "./src/util/url.js");
// Render a vector map










/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
function createMap( args ) {
	args = args ?? {
		overlay_opacity: 1.0,
	};

	const config = {
		style: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [
		'camantsoc_1836_1838',
		'camantsoc_1910',
		'camantsoc_1925',
		'barnwell_priory',
		'boundary',
		'heritage_trail',
		'attractions',
		'improvements',
	];

	const map = new _component_map_js__WEBPACK_IMPORTED_MODULE_0__.Map( {
		config,
		zOrder,
	} );

	if ( ! args.layers || args.layers.includes( '3d_buildings' ) ) {
		map.appData.layers.addLayer( _layer_buildings_js__WEBPACK_IMPORTED_MODULE_1__.addBuildingsLayer, {
			id: '3d_buildings',
			text: '3D buildings',
			color: '#aaaaaa',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'boundary' ) ) {
		map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_2__.addLineLayer, {
			id: 'boundary',
			text: 'Riverside area boundary',
			url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/line_boundary.json' ),
			color: 'black',
			visible: true,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'heritage_trail' ) ) {
		map.appData.layers.addLayer( _layer_line_js__WEBPACK_IMPORTED_MODULE_2__.addLineLayer, {
			id: 'heritage_trail',
			text: 'Heritage trail line',
			url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)(
				'%{PLUGIN}/public/assets/data/line_heritage_trail.json'
			),
			color: 'green',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'attractions' ) ) {
		map.appData.layers.addLayer( _layer_locations_js__WEBPACK_IMPORTED_MODULE_3__.addLocationsLayer, {
			id: 'attractions',
			text: 'Attractions',
			url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/locations.json' ),
			tags: [ 'attractions' ],
			color: 'yellow',
			onclick: args.locationOnClick ?? null,
			onenter: args.locationOnEnter ?? null,
			onleave: args.locationOnLeave ?? null,
			visible: args.locationVisible ?? false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'improvements' ) ) {
		map.appData.layers.addLayer( _layer_locations_js__WEBPACK_IMPORTED_MODULE_3__.addLocationsLayer, {
			id: 'improvements',
			text: 'Improvements',
			url: (0,_util_url_js__WEBPACK_IMPORTED_MODULE_5__.absUrl)( '%{PLUGIN}/public/assets/data/locations.json' ),
			tags: [ 'improvements' ],
			color: 'red',
			onclick: args.locationOnClick ?? null,
			onenter: args.locationOnEnter ?? null,
			onleave: args.locationOnLeave ?? null,
			visible: args.locationVisible ?? false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'barnwell_priory' ) ) {
		map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
			id: 'barnwell_priory',
			text: 'Barnwell Priory (historical)',
			color: 'orange',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'overlays' ) ) {
		map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
			id: 'camantsoc_1836_1838',
			text: 'Map circa 1836-1838',
			opacity: args.overlay_opacity,
			visible: false,
		} );

		map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
			id: 'camantsoc_1910',
			text: 'Map circa 1910',
			opacity: args.overlay_opacity,
			visible: false,
		} );

		map.appData.layers.addLayer( _layer_overlay_js__WEBPACK_IMPORTED_MODULE_4__.addOverlayLayer, {
			id: 'camantsoc_1925',
			text: 'Map circa 1925',
			opacity: args.overlay_opacity,
			visible: false,
		} );
	}

	return map;
}


/***/ }),

/***/ "./src/util/url.js":
/*!*************************!*\
  !*** ./src/util/url.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   absUrl: () => (/* binding */ absUrl)
/* harmony export */ });
// URL-mangling utilities

const PLACEHOLDER = '%{PLUGIN}';

function absUrl( url ) {
	if ( url.startsWith( PLACEHOLDER ) ) {
		return raraMapsData.baseUrl + url.slice( PLACEHOLDER.length );
	}
	return url;
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   boundaryRadiusCreateMap: () => (/* reexport safe */ _map_boundary_radius_js__WEBPACK_IMPORTED_MODULE_0__.createMap),
/* harmony export */   heritageTrailCreateMap: () => (/* reexport safe */ _map_heritage_trail_js__WEBPACK_IMPORTED_MODULE_1__.createMap),
/* harmony export */   historyCreateMap: () => (/* reexport safe */ _map_history_js__WEBPACK_IMPORTED_MODULE_2__.createMap),
/* harmony export */   vectorCreateMap: () => (/* reexport safe */ _map_vector_js__WEBPACK_IMPORTED_MODULE_3__.createMap)
/* harmony export */ });
/* harmony import */ var _map_boundary_radius_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map/boundary_radius.js */ "./src/map/boundary_radius.js");
/* harmony import */ var _map_heritage_trail_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map/heritage_trail.js */ "./src/map/heritage_trail.js");
/* harmony import */ var _map_history_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map/history.js */ "./src/map/history.js");
/* harmony import */ var _map_vector_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map/vector.js */ "./src/map/vector.js");
// index.js






})();

window.raraMaps = __webpack_exports__;
