// Map component

import { LayerManager } from '../component/layer.js';
import { Menu } from '../component/menu.js';
import { LocationManager } from '../component/location.js';

function addNavigationControl( map ) {
	map.addControl(
		new maplibregl.NavigationControl( {
			visualizePitch: true,
			visualizeRoll: true,
			showZoom: true,
			showCompass: true,
		} )
	);

	map.addControl( new maplibregl.FullscreenControl() );

	map.addControl( new maplibregl.ScaleControl(), 'bottom-right' );
}

/**
 * Create a Map
 * @param {Object}        args        The arguments
 * @param {Object}        args.config Map configuration
 * @param {Array<string>} args.zOrder List of layer IDs, lowest to highest
 */
export function Map( args ) {
	console.debug( 'Map', args );

	const map = new maplibregl.Map( args.config );

	const menu = new Menu();

	const layerManager = new LayerManager( {
		map,
		menu,
		zOrder: args.zOrder ?? [],
	} );

	const locationManager = new LocationManager( {
		map,
	} );

	map.appData = {
		layers: layerManager,
		locations: locationManager,
	};

	addNavigationControl( map );

	return map;
}
