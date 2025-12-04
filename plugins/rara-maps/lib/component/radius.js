// Component which allows camera to fly along a radius

export default function flyRouteRadius( args ) {
	let start = null;
	const playtime = 30000;
	const route = turf.lineString( args.coordinates );

	const centerPt = turf.point( args.center );

	const altitude = 300; // m
	const extend = 500; // m

	const animate = () => {
		start = start || Date.now();
		const progress = ( Date.now() - start ) % playtime;
		const boundaryPt = turf.along(
			route,
			( turf.lineDistance( route ) * progress ) / playtime
		).geometry.coordinates;

		// Compute distance (in km) and bearing between them
		const dist = turf.distance( centerPt, boundaryPt, { units: 'meters' } );
		const bearing = turf.bearing( centerPt, boundaryPt );

		// Extend the line
		const extendedDist = dist + extend;

		// Compute the new point 200 m beyond 'boundary' along the same bearing
		const extendedPt = turf.destination( centerPt, extendedDist, bearing, {
			units: 'meters',
		} );

		// Extract as [lng, lat]
		const extendedLngLat = extendedPt.geometry.coordinates;

		args.map.jumpTo(
			args.map.calculateCameraOptionsFromTo(
				new maplibregl.LngLat(
					extendedLngLat[ 0 ],
					extendedLngLat[ 1 ]
				),
				altitude,
				args.center
			)
		);

		requestAnimationFrame( animate );
	};

	animate();
}
