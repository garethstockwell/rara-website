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
		style: absUrl( '%{RARA_MAPS}/data/style.json' ),
		center: [ 0.144843, 52.212231 ],
		zoom: 15,
		container: 'map',
		attributionControl: false,
	};

	const zOrder = args.data.view.layers.map( ( layer ) => layer.name );

	/*
	[
		'camantsoc_1836_1838',
		'camantsoc_1910',
		'camantsoc_1925',
		'barnwell_priory',
		'boundary',
		'heritage_trail',
		'attractions',
		'improvements',
	];
	*/

	const map = new Map( {
		config,
		zOrder,
	} );

	args.data.view.layers.forEach( ( element ) => {
		if ( element.type === 'buildings' ) {
			map.appData.layers.addLayer( addBuildingsLayer, {
				id: element.name,
				visible: element.visible,
			} );
		}

		if ( element.type === 'line' ) {
			map.appData.layers.addLayer( addLineLayer, {
				id: element.name,
				data: args.data.featureCollections[ element.featureName ],
				color: element.color,
				visible: element.visible,
			} );
		}

		if ( element.type === 'locations' ) {
			map.appData.layers.addLayer( addLocationsLayer, {
				id: element.name,
				data: args.data.featureCollections[ element.featureName ],
				tags: element.tags,
				color: element.color,
				visible: element.visible,
				onclick: args.locationOnClick ?? null,
				onenter: args.locationOnEnter ?? null,
				onleave: args.locationOnLeave ?? null,
			} );
		}

		/*
		if ( element.type === 'overlay' ) {
			map.appData.layers.addLayer( addOverlayLayer, {
				id: element.name,
				url: absUrl( element.url ),
			} );
		}
		*/
	} );

	/*
	map.on( 'load', async () => {
		const attributions = args.data.attributions;
		const overlays = args.data.featureCollections.overlays;
		for ( const entry of overlays.features ) {
			console.log( entry.properties.id, entry.properties.id in zOrder );
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
							? attributions[ entry.properties.attribution ]
							: null,
						opacity: 1.0,
						visible: false,
					} );
				}
			}
		}
	} );
	*/

	return map;
}
