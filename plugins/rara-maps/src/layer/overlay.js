// Add a map layer which shows an image

import { addAttribution } from '../control/attribution.js';

import { absUrl } from '../util/url.js';

export function addOverlayLayer( map, options ) {
	const id = options.id;

	map.on( 'load', () => {
		fetch( absUrl( '%{RARA_MAPS}/public/assets/data/overlays.json' ) )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				const entry = data.overlays.features.find(
					( item ) => item.properties.id === id
				);

				// Add image source
				map.addSource( id, {
					type: 'image',
					url: absUrl( entry.properties.url ),
					coordinates: entry.geometry.coordinates,
				} );

				// Add raster layer using that source
				map.addLayer(
					{
						id,
						type: 'raster',
						source: id,
						paint: {
							'raster-opacity': options.opacity ?? 1.0,
						},
						layout: {
							visibility: options.visible ? 'visible' : 'none',
						},
					},
					options.zOrder ? options.zOrder.getPosition( id ) : null
				);

				if ( entry.properties.attribution ) {
					const attrib =
						data.attributions[ entry.properties.attribution ];
					if ( attrib ) {
						addAttribution( map, attrib );
					}
				}

				if ( options.callback ) {
					options.callback( [ 'overlay', id ] );
				}
			} );
	} );
}
