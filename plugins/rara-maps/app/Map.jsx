import { useEffect } from 'react';
import styles from './Map.module.css';
import createMap from '../map/src/vector.js';

export default function Map() {
  function loadMap() {
    createMap( {
			overlay_opacity: 0.75,
			locationVisible: true,
		} );
  }

	// After initial render, load the map
	useEffect( () => {
		loadMap();
	}, [] ); // empty dependency array = runs once after mount

	return <div id="map" className={ styles.map }></div>;
}
