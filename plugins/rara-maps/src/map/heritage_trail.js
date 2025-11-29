// Render a map of the heritage trail

import { Map } from '../component/map.js';
import { Route } from '../component/route.js';

import { addBuildingsLayer } from '../layer/buildings.js';
import { addLineLayer } from '../layer/line.js';
import { addLocationsLayer } from '../layer/locations.js';

import { absUrl } from '../util/url.js';

let route = null;

/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
export function createMap( args ) {
	args = args ?? {};

	const config = {
		style: absUrl( '%{RARA_MAPS}/assets/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = [ 'boundary', 'heritage_trail', 'locations', 'point' ];

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
		url: absUrl( '%{RARA_MAPS}/assets/data/line_boundary.json' ),
		color: 'black',
		visible: false,
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'heritage_trail',
		text: 'Heritage trail line',
		url: absUrl( '%{RARA_MAPS}/assets/data/line_heritage_trail.json' ),
		color: 'green',
		callback: ( {} ) => {
			route = new Route( {
				altitude: 200,
				distance: 500,
				lineId: 'heritage_trail',
				map,
			} );
		},
		visible: true,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'locations',
		text: 'Heritage trail locations',
		url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'green',
		onclick: args.locationOnClick ?? null,
		visible: true,
	} );

	const locations = map.appData.locations;

	/**
	 * Fly from source location to destination location
	 * @param {string} fromId Source location identifier
	 * @param {string} toId   Destination location identifier
	 */
	map.appData.fly = function ( fromId, toId ) {
		console.debug( `Fly from ${ fromId } to ${ toId }` );
		if ( fromId !== toId ) {
			const fromCoord =
				locations.getLocation( fromId ).data.geometry.coordinates;
			const toCoord =
				locations.getLocation( toId ).data.geometry.coordinates;
			console.debug(
				`Fly from ${ fromId } ${ fromCoord } to ${ toId } ${ toCoord }`
			);
			if ( route ) {
				route.fly( fromCoord, toCoord, 2000 );
			}
		}
	};

	return map;
}
