// Render a vector map

import { Map } from '../component/map.js';

import { addBuildingsLayer } from '../layer/buildings.js';
import { addLineLayer } from '../layer/line.js';
import { addLocationsLayer } from '../layer/locations.js';
import { addOverlayLayer } from '../layer/overlay.js';

import { absUrl } from '../util/url.js';

/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
export function createMap( args ) {
	args = args ?? {
		overlay_opacity: 1.0,
	};

	const config = {
		style: absUrl( '%{RARA_MAPS}/assets/data/style.json' ),
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

	const map = new Map( {
		config,
		zOrder,
	} );

	if ( ! args.layers || args.layers.includes( '3d_buildings' ) ) {
		map.appData.layers.addLayer( addBuildingsLayer, {
			id: '3d_buildings',
			text: '3D buildings',
			color: '#aaaaaa',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'boundary' ) ) {
		map.appData.layers.addLayer( addLineLayer, {
			id: 'boundary',
			text: 'Riverside area boundary',
			url: absUrl( '%{RARA_MAPS}/assets/data/line_boundary.json' ),
			color: 'black',
			visible: true,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'heritage_trail' ) ) {
		map.appData.layers.addLayer( addLineLayer, {
			id: 'heritage_trail',
			text: 'Heritage trail line',
			url: absUrl(
				'%{RARA_MAPS}/assets/data/line_heritage_trail.json'
			),
			color: 'green',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'attractions' ) ) {
		map.appData.layers.addLayer( addLocationsLayer, {
			id: 'attractions',
			text: 'Attractions',
			url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
			tags: [ 'attractions' ],
			color: 'yellow',
			onclick: args.locationOnClick ?? null,
			onenter: args.locationOnEnter ?? null,
			onleave: args.locationOnLeave ?? null,
			visible: args.locationVisible ?? false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'improvements' ) ) {
		map.appData.layers.addLayer( addLocationsLayer, {
			id: 'improvements',
			text: 'Improvements',
			url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
			tags: [ 'improvements' ],
			color: 'red',
			onclick: args.locationOnClick ?? null,
			onenter: args.locationOnEnter ?? null,
			onleave: args.locationOnLeave ?? null,
			visible: args.locationVisible ?? false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'barnwell_priory' ) ) {
		map.appData.layers.addLayer( addOverlayLayer, {
			id: 'barnwell_priory',
			text: 'Barnwell Priory (historical)',
			color: 'orange',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'overlays' ) ) {
		map.appData.layers.addLayer( addOverlayLayer, {
			id: 'camantsoc_1836_1838',
			text: 'Map circa 1836-1838',
			opacity: args.overlay_opacity,
			visible: false,
		} );

		map.appData.layers.addLayer( addOverlayLayer, {
			id: 'camantsoc_1910',
			text: 'Map circa 1910',
			opacity: args.overlay_opacity,
			visible: false,
		} );

		map.appData.layers.addLayer( addOverlayLayer, {
			id: 'camantsoc_1925',
			text: 'Map circa 1925',
			opacity: args.overlay_opacity,
			visible: false,
		} );
	}

	return map;
}
