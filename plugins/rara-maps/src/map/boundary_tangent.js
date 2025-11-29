// Fly around the boundary, with camera pointing along the boundary

import { Map } from '../component/map.js';
import { Route } from '../component/route.js';

import { addBuildingsLayer } from '../layer/buildings.js';
import { addLineLayer } from '../layer/line.js';
import { addLocationsLayer } from '../layer/locations.js';
import { addOverlayLayer } from '../layer/overlay.js';

import { absUrl } from '../util/url.js';

/**
 * Create the map
 * @return Map
 */
export function createMap() {
	const config = {
		style: absUrl( '%{RARA_MAPS}/public/assets/data/style.json' ),
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
		'heritage_trail',
		'boundary',
		'point',
		'attractions',
		'improvements',
	];

	const map = new Map( {
		config,
		zOrder,
	} );

	map.on( 'load', () => {
		map.addSource( 'point', {
			type: 'geojson',
			data: {
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Point',
					coordinates: [ 0.0, 0.0 ],
				},
			},
		} );

		map.addLayer(
			{
				id: 'point',
				source: 'point',
				type: 'circle',
				paint: {
					'circle-radius': 10,
					'circle-color': '#ff0000',
					'circle-stroke-width': 2,
					'circle-stroke-color': 'white',
				},
			},
			map.appData.layers.zOrder.getPosition( 'point' )
		);
	} );

	map.appData.layers.addLayer( addBuildingsLayer, {
		id: '3d_buildings',
		text: '3D buildings',
		color: '#aaaaaa',
		visible: true,
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'boundary',
		text: 'Riverside area boundary',
		url: absUrl( '%{RARA_MAPS}/public/assets/data/line_boundary.json' ),
		color: 'black',
		visible: true,
		callback: ( {} ) => {
			route = new Route( {
				altitude: 200,
				autoStart: true,
				distance: 500,
				lineId: 'boundary',
				map,
			} );
		},
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'heritage_trail',
		text: 'Heritage trail line',
		url: absUrl( '%{RARA_MAPS}/public/assets/data/line_heritage_trail.json' ),
		color: 'green',
		visible: false,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'attractions',
		text: 'Attractions',
		url: absUrl( '%{RARA_MAPS}/public/assets/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'yellow',
		visible: true,
		staticPopups: true,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'improvements',
		text: 'Improvements',
		url: absUrl( '%{RARA_MAPS}/public/assets/data/locations.json' ),
		tags: [ 'improvements' ],
		color: 'red',
		visible: true,
		staticPopups: true,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'barnwell_priory',
		text: 'Barnwell Priory (historical)',
		color: 'orange',
		visible: false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1836_1838',
		text: 'Map circa 1836-1838',
		opacity: 1.0,
		visible: false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1910',
		text: 'Map circa 1910',
		opacity: 1.0,
		visible: false,
	} );

	map.appData.layers.addLayer( addOverlayLayer, {
		id: 'camantsoc_1925',
		text: 'Map circa 1925',
		opacity: 1.0,
		visible: false,
	} );

	return map;
}
