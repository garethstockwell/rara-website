// Render history view

import { Map } from '../../lib/src/component/map.js';

import { addLineLayer } from '../../lib/src/layer/line.js';
import { addOverlayLayer } from '../../lib/src/layer/overlay.js';

import { absUrl } from '../../lib/src/util/url.js';

/**
 * Create the map
 * @return Map
 */
export function createMap() {
	const config = {
		style: absUrl( '%{RARA_MAPS}/app/assets/data/style.json' ),
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

	const map = new Map( {
		config,
		zOrder,
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'boundary',
		text: 'Riverside area boundary',
		url: absUrl( '%{RARA_MAPS}/app/assets/data/line_boundary.json' ),
		color: 'black',
		visible: true,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1836_1838',
		text: 'Map circa 1836-1838',
		opacity: 1.0,
		visible: false,
		addToMenu: false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1910',
		text: 'Map circa 1910',
		opacity: 1.0,
		visible: false,
		addToMenu: false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1925',
		text: 'Map circa 1925',
		opacity: 1.0,
		visible: false,
		addToMenu: false,
	} );

	return map;
}
