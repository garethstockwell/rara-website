import { useEffect, useRef, useState } from 'react';
import common from './common.module.css';
import styles from './Panel.module.css';
import Dashboard from './Dashboard.jsx';

export default function Panel( { footer, onLoad } ) {
	const panelRef = useRef( null );

	// After initial render, move footer element to the end of the panel
	useEffect( () => {
		if ( panelRef.current && footer ) {
			panelRef.current.appendChild( footer );
			if (onLoad) {
				onLoad();
			}
		}
	}, [] ); // empty dependency array = runs once after mount

	const [ panelOpen, setPanelOpen ] = useState( false );

	function togglePanel() {
		console.log( 'togglePanel' );
		setPanelOpen( ( v ) => ! v );
	}

	return (
		<div
			ref={ panelRef } // attach panelRef to this div
			className={ `${ common.card } ${ styles.panel } ${
				panelOpen ? styles.panel_open : styles.panel_closed
			}` }
		>
			<Dashboard onClick={ togglePanel } />
			<div className="panel-body">Panel body</div>
		</div>
	);
}
