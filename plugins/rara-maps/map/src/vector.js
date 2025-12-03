// Render a vector map

import { Map } from '../../lib/src/component/map.js';

import { addBuildingsLayer } from '../../lib/src/layer/buildings.js';
import { addLineLayer } from '../../lib/src/layer/line.js';
import { addLocationsLayer } from '../../lib/src/layer/locations.js';
import { addOverlayLayer } from '../../lib/src/layer/overlay.js';

import { absUrl } from '../../lib/src/util/url.js';

/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
export default function createMap( args ) {
	args = args ?? {
		overlay_opacity: 1.0,
	};

	const config = {
		style: absUrl( '%{RARA_MAPS}/map/assets/data/style.json' ),
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
			url: absUrl( '%{RARA_MAPS}/map/assets/data/line_boundary.json' ),
			color: 'black',
			visible: true,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'heritage_trail' ) ) {
		map.appData.layers.addLayer( addLineLayer, {
			id: 'heritage_trail',
			text: 'Heritage trail line',
			url: absUrl(
				'%{RARA_MAPS}/map/assets/data/line_heritage_trail.json'
			),
			color: 'green',
			visible: false,
		} );
	}

	if ( ! args.layers || args.layers.includes( 'attractions' ) ) {
		map.appData.layers.addLayer( addLocationsLayer, {
			id: 'attractions',
			text: 'Attractions',
			url: absUrl( '%{RARA_MAPS}/map/assets/data/locations.json' ),
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
			url: absUrl( '%{RARA_MAPS}/map/assets/data/locations.json' ),
			tags: [ 'improvements' ],
			color: 'red',
			onclick: args.locationOnClick ?? null,
			onenter: args.locationOnEnter ?? null,
			onleave: args.locationOnLeave ?? null,
			visible: args.locationVisible ?? false,
		} );
	}

	map.on( 'load', async () => {
		fetch( absUrl( '%{RARA_MAPS}/map/assets/data/overlays.json' ) )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				for ( const entry of data.overlays.features ) {
					console.log(
						entry.properties.id,
						entry.properties.id in zOrder
					);
					if ( zOrder.includes( entry.properties.id ) ) {
						if (
							! args.layers ||
							args.layers.includes( entry.properties.id )
						) {
							map.appData.layers.addLayer( addOverlayLayer, {
								id: entry.properties.id,
								text: entry.properties.description[ 0 ],
								url: absUrl( entry.properties.url ),
								coordinates: entry.geometry.coordinates,
								attribution: entry.properties.attribution
									? data.attributions[
											entry.properties.attribution
									  ]
									: null,
								opacity: 1.0,
								visible: false,
							} );
						}
					}
				}
			} );
	} );

	return map;
}
