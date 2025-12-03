import { useEffect, useRef } from 'react';
import styles from './Map.module.css';
import createMap from '../map/src/vector_2.js';

export default function Map( { data, setActiveLocation } ) {
	const mapRef = useRef();

	function locationOnClick( id ) {
		if ( mapRef.current ) {
			setActiveLocation( {
				id,
				location: mapRef.current.appData.locations.getLocation( id ),
			} );
		}
	}

	function loadMap() {
		mapRef.current = createMap( {
			data: data,
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
