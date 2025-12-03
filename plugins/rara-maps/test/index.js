// eslint-disable-next-line no-unused-vars
const raraMapsData = { baseUrl: 'http://localhost:3000' };

document.addEventListener( 'DOMContentLoaded', () => {
	const header = document.querySelector( '.site-header' );

	setTimeout( () => {
		header.classList.add( 'hidden' );
	}, 1000 );

	let lastScrollY = window.scrollY;

	window.addEventListener( 'scroll', () => {
		const currentY = window.scrollY;

		console.log( 'currentY', currentY );

		if ( currentY > lastScrollY ) {
			header.classList.add( 'hidden' );
		} else {
			header.classList.remove( 'hidden' );
		}

		lastScrollY = currentY;
	} );
} );

function createToolbar( name ) {
	function addToolbarItem( name, text, active ) {
		const link = document.createElement( 'a' );
		link.href = `${ name }.html`;
		link.textContent = text;
		link.className = active ? 'active' : '';

		const toolbar = document.getElementById( 'toolbar' );
		toolbar.appendChild( link );
	}

	new Map( [
		[ 'index', 'Attractions' ],
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
