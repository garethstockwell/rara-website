import { useEffect, useState } from 'react';
import styles from './App.module.css';
import HeaderHandle from './HeaderHandle.jsx';
import Map from './Map.jsx';
import Panel from './Panel.jsx';
import { absUrl } from '../lib/src/util/url.js';

export default function App( { footer, viewName } ) {
	const [ data, setData ] = useState( null );
	const [ panelLoaded, setPanelLoaded ] = useState( false );
	const [ activeLocation, setActiveLocation ] = useState( {
		id: null,
		location: null,
	} );

	useEffect( () => {
		let cancelled = false;

		fetch( absUrl( '%{RARA_MAPS}/build/data.json' ) )
			.then( ( res ) => {
				if ( ! res.ok ) throw new Error( 'Network error' );
				return res.json();
			} )
			.then( ( json ) => {
				if ( ! cancelled ) {
					setData( {
						...json,
						featureCollections: json.featureCollections.reduce(
							( acc, coll ) => {
								acc[ coll.name ] = coll;
								return acc;
							},
							{}
						),
						view: json.views[ viewName ],
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
				<Map data={ data } setActiveLocation={ setActiveLocation } />
			) }

			<Panel
				activeLocation={ activeLocation }
				footer={ footer }
				onLoad={ () => {
					setPanelLoaded( true );
				} }
			/>
		</div>
	);
}
