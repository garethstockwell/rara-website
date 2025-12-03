import { useEffect, useRef, useState } from 'react';
import common from './common.module.css';
import styles from './Panel.module.css';
import Dashboard from './Dashboard.jsx';

export default function Panel( {
	activeTabId,
	activeTabTitle,
	footer,
	onLoad,
} ) {
	const contentElem = document.querySelector( '.rara-maps-content' );

	const panelRef = useRef( null );
	const panelBodyRef = useRef( null );
	const [ panelOpen, setPanelOpen ] = useState( false );
	const activeTabElem = useRef();

	// After initial render, move content and footer elements to the end of the panel
	useEffect( () => {
		if ( panelBodyRef.current && contentElem ) {
			panelBodyRef.current.appendChild( contentElem );
		}

		if ( panelRef.current && footer ) {
			panelRef.current.appendChild( footer );
		}

		if ( onLoad ) {
			onLoad();
		}
	}, [] ); // empty dependency array = runs once after mount

	function togglePanel() {
		setPanelOpen( ( v ) => ! v );
	}

	useEffect( () => {
		if ( activeTabElem.current ) {
			activeTabElem.current.classList.add( 'hidden' );
		}

		activeTabElem.current = document.querySelector( '#' + activeTabId );

		if ( activeTabElem.current ) {
			activeTabElem.current.classList.remove( 'hidden' );
		}
	}, [ activeTabId ] );

	return (
		<div
			ref={ panelRef }
			className={ `${ common.card } ${ styles.panel } ${
				panelOpen ? styles.panel_open : styles.panel_closed
			}` }
		>
			<Dashboard title={ activeTabTitle } onClick={ togglePanel } />

			<div ref={ panelBodyRef } className="panel-body"></div>
		</div>
	);
}
