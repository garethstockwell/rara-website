import { useEffect, useRef, useState } from 'react';
import styles from './Map.module.css';
import createMap from '../lib/component/map.js';
import flyRouteRadius from '../lib/component/radius.js';
import { Route, flyRouteTangent } from '../lib/component/route.js';

export default function Map( {
	panelEnabled,
	panelOpen,
	data,
	activeObjectId,
	setActiveObjectId,
	setActiveObjectTitle,
	setActiveObjectIndex,
} ) {
	const [ mapLoaded, setMapLoaded ] = useState( false );
	const mapRef = useRef();
	const mapElemRef = useRef();
	const oldActiveObject = useRef();
	const routeRef = useRef();

	function locationOnClick( id ) {
		setActiveObjectId( id );
	}

	function onLocationChange() {
		if ( mapRef.current ) {
			const locations = mapRef.current.appData.locations;

			if ( oldActiveObject.current ) {
				oldActiveObject.current.popupVisible = false;
			}

			if ( activeObjectId ) {
				const loc = locations.getLocation( activeObjectId );
				if ( loc ) {
					loc.popupVisible = true; // TODO: make this sticky

					if ( data.view.fly === 'direct' ) {
						mapRef.current.flyTo( {
							center: loc.data.geometry.coordinates,
						} );
					}

					if ( loc.data ) {
						setActiveObjectTitle(
							loc ? loc.data.properties.title : ''
						);

						if ( data.view.fly === 'route' ) {
							const fromCoord =
								oldActiveObject.current.data.geometry
									.coordinates;
							const toCoord = loc.data.geometry.coordinates;
							console.debug(
								`Fly from ${ oldActiveObject } ${ fromCoord } to ${ activeObjectId } ${ toCoord }`
							);
							routeRef.current.fly( fromCoord, toCoord, 2000 );
						}
					}

					if ( loc.data ) {
						setActiveObjectTitle(
							loc ? loc.data.properties.title : ''
						);
					}
				}

				oldActiveObject.current = loc;
			}
		}
	}

	function onOverlayChange() {
		if ( mapRef.current ) {
			const layers = mapRef.current.appData.layers;

			if ( oldActiveObject.current ) {
				layers.getLayer( oldActiveObject.current ).visible = false;
			}

			layers.getLayer( activeObjectId ).visible = true;

			oldActiveObject.current = activeObjectId;
		}
	}

	function onActiveObjectChange() {
		if ( mapLoaded ) {
			if ( data.view.mode === 'location' ) {
				onLocationChange();
			}

			if ( data.view.mode === 'overlay' ) {
				onOverlayChange();
			}
		}
	}

	useEffect( () => {
		onActiveObjectChange();
	}, [ activeObjectId ] );

	useEffect( () => {
		onActiveObjectChange();
	}, [ mapLoaded ] );

	function loadMap() {
		mapRef.current = createMap( {
			container: 'map',
			data,
			overlay_opacity: 0.75,
			locationOnClick,
			locationVisible: true,
		} );

		mapRef.current.on( 'load', () => {
			setMapLoaded( true );

			if ( data.view.mode === 'fly_radius' ) {
				flyRouteRadius( {
					center: data.view.config.center,
					coordinates:
						data.lines[ data.view.route ].geometry.coordinates,
					map: mapRef.current,
				} );
			}

			if ( data.view.mode === 'fly_tangent' ) {
				flyRouteTangent( {
					coordinates:
						data.lines[ data.view.route ].geometry.coordinates,
					map: mapRef.current,
				} );
			}

			if ( data.view.fly === 'route' ) {
				routeRef.current = new Route( {
					coordinates:
						data.lines[ data.view.route ].geometry.coordinates,
					map: mapRef.current,
				} );

				setActiveObjectIndex( 0 );
			}
		} );
	}

	// After initial render, load the map
	useEffect( () => {
		loadMap();
	}, [] ); // empty dependency array = runs once after mount

	return (
		<div
			ref={ mapElemRef }
			id="map"
			className={ `
			${ styles.map }
			${ panelEnabled ? styles.panel_enabled : '' }
			${ panelOpen ? styles.panel_open : '' }
			` }
		></div>
	);
}
