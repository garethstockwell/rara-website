// Fly around the boundary, with camera pointing to the centre

import { Map } from '../component/map.js';

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
		style: absUrl( '%{RARA_MAPS}/assets/data/style.json' ),
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

	let start = null;
	const playtime = 30000;
	let route = null;

	const center = new maplibregl.LngLat(
		0.14547600132800653,
		52.212610097321885
	);
	const centerPt = turf.point( [ center.lng, center.lat ] );

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

		map.jumpTo(
			map.calculateCameraOptionsFromTo(
				new maplibregl.LngLat(
					extendedLngLat[ 0 ],
					extendedLngLat[ 1 ]
				),
				altitude,
				center
			)
		);

		requestAnimationFrame( animate );
	};

	map.on( 'load', async () => {
		fetch( absUrl( '%{RARA_MAPS}/assets/data/line_boundary_smooth.json' ) )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				const coordinates = data.features[ 0 ].geometry.coordinates;
				route = turf.lineString( coordinates );
				animate();
			} );
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
		visible: true,
	} );

	map.appData.layers.addLayer( addLineLayer, {
		id: 'heritage_trail',
		text: 'Heritage trail line',
		url: absUrl( '%{RARA_MAPS}/assets/data/line_heritage_trail.json' ),
		color: 'green',
		visible: false,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'attractions',
		text: 'Attractions',
		url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
		tags: [ 'attractions' ],
		color: 'yellow',
		visible: true,
		staticPopups: true,
	} );

	map.appData.layers.addLayer( addLocationsLayer, {
		id: 'improvements',
		text: 'Improvements',
		url: absUrl( '%{RARA_MAPS}/assets/data/locations.json' ),
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
