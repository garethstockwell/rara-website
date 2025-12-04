import { useEffect, useRef } from 'react';
import styles from './Map.module.css';
import createMap from '../map/src/flat.js';

export default function Map( {
	data,
	activeLocationId,
	setActiveLocationId,
	setActiveLocationTitle,
} ) {
	const mapRef = useRef();
	const oldActiveLocation = useRef();

	function updateActiveLocationTitle() {
		if ( mapRef.current ) {
			const loc = mapRef.current.appData.locations.getLocation( activeLocationId );
			setActiveLocationTitle(loc ? loc.data.properties.title : "");
		}
	}

	function locationOnClick( id ) {
		setActiveLocationId( id );
	}

	useEffect( () => {
		updateActiveLocationTitle();

		if (mapRef.current) {
			if (oldActiveLocation.current) {
				oldActiveLocation.current.popupVisible = false;
			}

			const loc = mapRef.current.appData.locations.getLocation( activeLocationId );
			if (loc) {
				loc.popupVisible = true; // TODO: make this sticky
			}

			oldActiveLocation.current = loc;
		}
	}, [ activeLocationId ] );

	function loadMap() {
		mapRef.current = createMap( {
			container: 'map',
			data,
			overlay_opacity: 0.75,
			locationOnClick,
			locationVisible: true,
		} );
	}

	// After initial render, load the map
	useEffect( () => {
		loadMap();
	}, [] ); // empty dependency array = runs once after mount

	return <div id="map" className={ styles.map }></div>;
}
