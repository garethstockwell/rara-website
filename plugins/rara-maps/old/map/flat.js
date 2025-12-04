// Render a vector map

import { Map } from '../../lib/component/map.js';

import { addBuildingsLayer } from '../../lib/layer/buildings.js';
import { addLineLayer } from '../../lib/layer/line.js';
import { addLocationsLayer } from '../../lib/layer/locations.js';
import { addOverlayLayer } from '../../lib/layer/overlay.js';

import { absUrl } from '../../lib/util/url.js';

/**
 * Create the map
 * @param {Object} args The arguments
 * @return Map
 */
export default function createMap( args ) {
	args = args ?? {
		overlay_opacity: 1.0,
	};

	const view = args.data.view;

	const config = {
		...view.config,
		style:
			typeof view.config.style === 'string'
				? absUrl( view.config.style )
				: view.config.style,
		container: args.container,
		attributionControl: false,
	};

	const zOrder = view.layers.map( ( layer ) => layer.name );

	const map = new Map( {
		config,
		zOrder,
	} );

	const attributions = args.data.attributions;

	view.layers.forEach( ( element ) => {
		if ( element.type === 'buildings' ) {
			map.appData.layers.addLayer( addBuildingsLayer, {
				id: element.name,
				visible: element.visible,
			} );
		}

		if ( element.type === 'line' ) {
			const line = args.data.lines[ element.name ];
			map.appData.layers.addLayer( addLineLayer, {
				id: element.name,
				data: line,
				color: element.color,
				visible: element.visible,
			} );
		}

		if ( element.type === 'locations' ) {
			map.appData.layers.addLayer( addLocationsLayer, {
				id: element.name,
				data: args.data.locations,
				tags: element.tags,
				color: element.color,
				visible: element.visible,
				onclick: args.locationOnClick ?? null,
				onenter: args.locationOnEnter ?? null,
				onleave: args.locationOnLeave ?? null,
			} );
		}

		if ( element.type === 'overlay' ) {
			const overlay = args.data.overlays[ element.name ];
			map.appData.layers.addLayer( addOverlayLayer, {
				id: element.name,
				url: absUrl( overlay.properties.url ),
				coordinates: overlay.geometry.coordinates,
				attribution: overlay.properties.attribution
					? attributions[ overlay.properties.attribution ]
					: null,
				opacity: 1.0,
				visible: element.visible,
			} );
		}
	} );

	return map;
}
