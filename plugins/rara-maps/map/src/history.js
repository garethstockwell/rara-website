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
		style: absUrl( '%{RARA_MAPS}/data/style.json' ),
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
		url: absUrl( '%{RARA_MAPS}/data/line_boundary.json' ),
		color: 'black',
		visible: true,
	} );

	map.on( 'load', async () => {
		Promise.all( [
			fetch( absUrl( '%{RARA_MAPS}/data/overlays.json' ) ).then( ( r ) =>
				r.json()
			),
			fetch( absUrl( '%{RARA_MAPS}/data/attributions.json' ) ).then(
				( r ) => r.json()
			),
		] ).then( ( [ overlays, attributions ] ) => {
			for ( const entry of overlays.features ) {
				console.log(
					entry.properties.id,
					entry.properties.id in zOrder
				);
				if ( zOrder.includes( entry.properties.id ) ) {
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
						addToMenu: false,
					} );
				}
			}
		} );
	} );

	return map;
}
