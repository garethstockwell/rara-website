// Fly around the boundary, with camera pointing along the boundary

import { Map } from '../../lib/component/map.js';
import { Route } from '../../lib/component/route.js';

import { addBuildingsLayer } from '../../lib/layer/buildings.js';
import { addLineLayer } from '../../lib/layer/line.js';
import { addLocationsLayer } from '../../lib/layer/locations.js';

import { absUrl } from '../../lib/util/url.js';

/**
 * Create the map
 * @return Map
 */
export function createMap() {
	const config = {
		style: absUrl( '%{RARA_MAPS}/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [
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
		url: absUrl( '%{RARA_MAPS}/data/line_boundary.json' ),
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
		url: absUrl( '%{RARA_MAPS}/data/line_heritage_trail.json' ),
		color: 'green',
		visible: false,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'attractions',
		text: 'Attractions',
		url: absUrl( '%{RARA_MAPS}/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'yellow',
		visible: true,
		staticPopups: true,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'improvements',
		text: 'Improvements',
		url: absUrl( '%{RARA_MAPS}/data/locations.json' ),
		tags: [ 'improvements' ],
		color: 'red',
		visible: true,
		staticPopups: true,
	} );

	return map;
}
