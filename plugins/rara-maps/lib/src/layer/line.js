// Add a map layer which shows a line

export function addLineLayer( map, options ) {
	const id = options.id;

	map.on( 'load', () => {
		fetch( options.url )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				map.addSource( id, {
					type: 'geojson',
					data,
				} );

				map.addLayer(
					{
						id,
						type: 'line',
						source: id,
						layout: {
							'line-join': 'round',
							'line-cap': 'round',
							visibility: options.visible ? 'visible' : 'none',
						},
						paint: {
							'line-color': options.color,
							'line-width': 6,
						},
					},
					options.zOrder ? options.zOrder.getPosition( id ) : null
				);

				if ( options.callback ) {
					options.callback( [ 'line', id ] );
				}
			} );
	} );
}
