// Render a raster map

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
	args = args ?? {};

	const config = {
		style: {
			version: 8,
			sources: {
				osm: {
					type: 'raster',
					tiles: [
						'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap Tile URL
					],
					tileSize: 256,
				},
			},
			layers: [
				{
					id: 'osm-layer',
					type: 'raster',
					source: 'osm',
					minzoom: 0,
				},
			],
		},
		center: [ 0.144843, 52.212231 ], // [lng, lat]
		zoom: 15,
		maxZoom: 18,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [
		'camantsoc_1910',
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

	map.appData.layers.addLayer( addBuildingsLayer, {
		id: '3d_buildings',
		text: '3D buildings',
		color: '#aaaaaa',
		visible: false,
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'boundary',
		text: 'Riverside area boundary',
		url: absUrl( '%{RARA_MAPS}/assets/data/line_boundary.json' ),
		color: 'black',
		visible: true,
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'heritage_trail',
		text: 'Heritage trail line',
		url: absUrl( '%{RARA_MAPS}/assets/data/line_heritage_trail.json' ),
		color: 'green',
		visible: false,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'attractions',
		text: 'Attractions',
		url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'yellow',
		onclick: args.locationOnClick ?? null,
		visible: args.locationVisible ?? false,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'improvements',
		text: 'Improvements',
		url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
		tags: [ 'improvements' ],
		color: 'red',
		onclick: args.locationOnClick ?? null,
		visible: args.locationVisible ?? false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'barnwell_priory',
		text: 'Barnwell Priory (historical)',
		color: 'orange',
		visible: false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1910',
		text: 'Map circa 1910',
		opacity: 0.75,
		visible: false,
	} );

	return map;
}
