// Helper functions for creating a horizontal toolbar

function addToolbarItem( name, text, active ) {
	const link = document.createElement( 'a' );
	link.href = `${ name }.html`;
	link.textContent = text;
	link.className = active ? 'active' : '';

	const toolbar = document.getElementById( 'toolbar' );
	toolbar.appendChild( link );
}

export function createToolbar( name ) {
	new Map( [
		[ 'attractions', 'Attractions' ],
		[ 'improvements', 'Improvements' ],
		[ 'history', 'History' ],
		[ 'heritage_trail', 'Heritage trail' ],
		[ 'boundary_radius', 'Boundary radius' ],
		[ 'vector', 'Vector' ],
		[ 'boundary_tangent', 'Boundary tangent' ],
		[ 'globe', 'Globe' ],
		[ 'raster', 'Raster' ],
	] ).forEach( function ( value, key ) {
		addToolbarItem( key, value, key === name );
	} );
}
