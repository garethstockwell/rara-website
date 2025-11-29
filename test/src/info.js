// Information panel

export class Info {
	#elem;
	#event;
	#freeze;
	#map;

	/**
	 * Create an Info panel
	 * @param {Object}         args     The arguments
	 * @param {maplibregl.Map} args.map The map
	 */
	constructor( args ) {
		this.#elem = document.getElementById( 'info' );
		this.#event = null;
		this.#freeze = false;
		this.#map = args.map;

		if ( this.#elem ) {
			const info = this;
			function onZoom( {} ) {
				setTimeout( function () {
					info.#update();
				}, 700 );
			}

			document
				.getElementsByClassName( 'maplibregl-ctrl-zoom-in' )[ 0 ]
				.addEventListener( 'click', onZoom );
			document
				.getElementsByClassName( 'maplibregl-ctrl-zoom-out' )[ 0 ]
				.addEventListener( 'click', onZoom );

			const handleKeyDown = ( e ) => {
				if ( e.key === 'f' ) {
					this.#freeze = ! this.#freeze;
				}

				if ( e.key === 'i' ) {
					this.#toggleVisible();
				}
			};

			document.addEventListener( 'keydown', handleKeyDown, true );

			this.#map.on( 'mousemove', ( e ) => {
				this.#event = e;
				this.#update();
			} );
		}
	}

	#toggleVisible() {
		this.#elem.style.display =
			this.#elem.style.display === 'block' ? 'none' : 'block';
	}

	#update() {
		if ( ! this.#freeze ) {
			this.#elem.innerHTML = `${
				// e.point is the x, y coordinates of the mousemove event relative
				// to the top-left corner of the map
				this.#event ? JSON.stringify( this.#event.point ) : ''
			} zoom:${ this.#map.getZoom() }<br />
        ${
			// e.lngLat is the longitude, latitude geographical position of the event
			this.#event ? JSON.stringify( this.#event.lngLat.wrap() ) : ''
		}`;
		}
	}
}
