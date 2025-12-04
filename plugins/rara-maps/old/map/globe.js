// Render a globe map

import { Map } from '../../lib/component/map.js';

/**
 * Create the map
 * @return Map
 */
export function createMap() {
	const config = {
		style: 'https://demotiles.maplibre.org/globe.json',
		center: [ 0.144843, 52.212231 ],
		zoom: 1,
		container: 'map',
		attributionControl: false,
	};

	const map = new Map( {
		config,
	} );

	return map;
}
