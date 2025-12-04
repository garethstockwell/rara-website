import { createRoot } from 'react-dom/client';

import './global.css';

import App from './app/App.jsx';

function mount() {
	const container = document.getElementById( 'rara-maps-react-root' );
	if ( ! container ) {
		return;
	}

	const viewName = container.getAttribute( 'view-name' );

	// The footer element is passed into the App so that it can be relocated
	// within the DOM, using a React effect callback.
	const footer = document.querySelector( '.site-footer' );

	if ( footer ) {
		footer.classList.add( 'hidden' );
	}

	const root = createRoot( container );
	root.render( <App footer={ footer } viewName={ viewName } /> );
}

// Automatically mount when the page loads
document.addEventListener( 'DOMContentLoaded', mount );

// Optional: export mount() so WordPress / other scripts can call it manually
export { mount };
