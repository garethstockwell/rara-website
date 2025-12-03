import { useEffect, useRef, useState } from 'react';
import common from './common.module.css';
import styles from './Panel.module.css';
import Dashboard from './Dashboard.jsx';

export default function Panel( { activeLocation, footer, onLoad } ) {
	const contentElem = document.querySelector( '.rara-maps-content' );

	const panelRef = useRef( null );
	const panelBodyRef = useRef( null );

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

	const [ panelOpen, setPanelOpen ] = useState( false );

	function togglePanel() {
		setPanelOpen( ( v ) => ! v );
	}

	const activeContentElem = useRef();
	const [ activeContentTitle, setActiveContentTitle ] = useState( '' );

	useEffect( () => {
		if ( activeContentElem.current ) {
			activeContentElem.current.classList.add( 'hidden' );
		}

		activeContentElem.current = document.querySelector(
			'#' + activeLocation.id
		);

		if ( activeContentElem.current ) {
			activeContentElem.current.classList.remove( 'hidden' );
			setActiveContentTitle(
				activeLocation.location.data.properties.title
			);
		} else {
			setActiveContentTitle( '' );
		}
	}, [ activeLocation ] );

	return (
		<div
			ref={ panelRef }
			className={ `${ common.card } ${ styles.panel } ${
				panelOpen ? styles.panel_open : styles.panel_closed
			}` }
		>
			<Dashboard title={ activeContentTitle } onClick={ togglePanel } />

			<div ref={ panelBodyRef } className="panel-body"></div>
		</div>
	);
}
