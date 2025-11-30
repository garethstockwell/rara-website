// Add a map layer which shows locations

import { absUrl } from '../util/url.js';

/**
 * Create the map
 * @param          map
 * @param {Object} args The arguments
 */
export function addLocationsLayer( map, args ) {
	map.on( 'load', async () => {
		const id = args.id;

		const locations = map.appData.locations;

		const image = await map.loadImage(
			absUrl( `%{RARA_MAPS}/lib/assets/icons/pin-${ args.color }.png` )
		);
		map.addImage( id, image.data );

		fetch( args.url )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				if ( args.tags ) {
					data.features = data.features.filter( ( feature ) =>
						args.tags.every( ( x ) =>
							feature.properties.tags.includes( x )
						)
					);
				}

				data.features.forEach( ( feature ) => {
					const loc = locations.getLocation( feature.properties.id );
					loc.setData( feature );
					if ( args.staticPopups ) {
						loc.popupVisible = true;
					}
				} );

				map.addSource( id, {
					type: 'geojson',
					data,
				} );

				map.addLayer(
					{
						id,
						type: 'symbol',
						source: id,
						layout: {
							'icon-image': id,
							'icon-size': 1.0,
							'icon-allow-overlap': true,
							visibility: args.visible ? 'visible' : 'none',
						},
					},
					args.zOrder ? args.zOrder.getPosition( id ) : null
				);

				if ( ! args.staticPopups ) {
					// Make sure to detect marker change for overlapping markers
					// and use mousemove instead of mouseenter event
					let currentFeatureId;
					let currentFeatureCoordinates;
					map.on( 'mousemove', id, ( e ) => {
						const featureCoordinates =
							e.features[ 0 ].geometry.coordinates.toString();
						if (
							currentFeatureCoordinates !== featureCoordinates
						) {
							currentFeatureCoordinates = featureCoordinates;

							// Change the cursor style as a UI indicator.
							map.getCanvas().style.cursor = 'pointer';

							const coordinates =
								e.features[ 0 ].geometry.coordinates.slice();

							// Ensure that if the map is zoomed out such that multiple
							// copies of the feature are visible, the popup appears
							// over the copy being pointed to.
							while (
								Math.abs( e.lngLat.lng - coordinates[ 0 ] ) >
								180
							) {
								coordinates[ 0 ] +=
									e.lngLat.lng > coordinates[ 0 ]
										? 360
										: -360;
							}

							if ( currentFeatureId ) {
								locations.getLocation(
									currentFeatureId
								).popupVisible = false;
							}

							currentFeatureId = e.features[ 0 ].properties.id;
							locations.getLocation(
								currentFeatureId
							).popupVisible = true;

							if ( args.onenter ) {
								args.onenter( currentFeatureId );
							}
						}
					} );

					map.on( 'mouseleave', id, () => {
						const featureId = currentFeatureId;

						/*
            map.getCanvas().style.cursor = '';
            locations.getLocation(currentFeatureId).popupVisible = false;
            currentFeatureId = undefined;
            currentFeatureCoordinates = undefined;
            */

						if ( args.onleave ) {
							args.onleave( featureId );
						}
					} );
				}

				if ( args.onclick ) {
					map.on( 'click', id, ( e ) => {
						args.onclick( e.features[ 0 ].properties.id );
					} );
				}
			} );
	} );
}
