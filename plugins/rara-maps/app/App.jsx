import { useEffect, useState } from 'react';
import styles from './App.module.css';
import HeaderHandle from './HeaderHandle.jsx';
import Map from './Map.jsx';
import Panel from './Panel.jsx';
import { absUrl } from '../lib/src/util/url.js';

export default function App( { footer, viewName } ) {
	const [ data, setData ] = useState( null );
	const [ panelLoaded, setPanelLoaded ] = useState( false );
	const [ activePanelTabId, setActivePanelTabId ] = useState( null );
	const [ activePanelTitle, setActivePanelTitle ] = useState( null );

	function arrayToMap( arr ) {
		return arr.reduce( ( acc, obj ) => {
			acc[ obj.name ] = obj;
			return acc;
		}, {} );
	}

	useEffect( () => {
		let cancelled = false;

		fetch( absUrl( '%{RARA_MAPS}/build/data.json' ) )
			.then( ( res ) => {
				if ( ! res.ok ) {
					throw new Error( 'Network error' );
				}
				return res.json();
			} )
			.then( ( json ) => {
				if ( ! cancelled ) {
					setData( {
						...json,
						lines: arrayToMap( json.lines ),
						overlays: arrayToMap( json.overlays.features ),
						view: arrayToMap( json.views )[ viewName ],
					} );
				}
			} );

		// Cleanup to avoid setting state after unmount
		return () => {
			cancelled = true;
		};
	}, [] ); // Empty deps array → run once on mount

	return (
		<div className={ styles.app }>
			<HeaderHandle />

			{ data && panelLoaded && (
				<Map
					data={ data }
					activeLocationId={ activePanelTabId }
					setActiveLocationId={ setActivePanelTabId }
					setActiveLocationTitle={ setActivePanelTitle }
				/>
			) }

			<Panel
				activeTabId={ activePanelTabId }
				setActiveTabId={ setActivePanelTabId }
				activeTabTitle={ activePanelTitle }
				footer={ footer }
				onLoad={ () => {
					setPanelLoaded( true );
				} }
			/>
		</div>
	);
}
