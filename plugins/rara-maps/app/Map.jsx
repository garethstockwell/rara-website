import { useEffect, useRef } from 'react';
import styles from './Map.module.css';
import createMap from '../map/src/flat.js';

export default function Map( {
	data,
	setActiveLocationId,
	setActiveLocationTitle,
} ) {
	const mapRef = useRef();

	function locationOnClick( id ) {
		setActiveLocationId( id );
		if ( mapRef.current ) {
			setActiveLocationTitle(
				mapRef.current.appData.locations.getLocation( id ).data
					.properties.title
			);
		}
	}

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
