import { useState } from 'react';
import styles from './App.module.css';
import HeaderHandle from './HeaderHandle.jsx';
import Map from './Map.jsx';
import Panel from './Panel.jsx';

export default function App( { footer } ) {
	const [ footerMoved, setFooterMoved ] = useState( false );

	const [ activeLocation, setActiveLocation ] = useState( {
		id: null,
		location: null,
	} );

	return (
		<div className={ styles.app }>
			<HeaderHandle />

			{ footerMoved && <Map setActiveLocation={ setActiveLocation } /> }

			<Panel
				activeLocation={ activeLocation }
				footer={ footer }
				onLoad={ () => {
					setFooterMoved( true );
				} }
			/>
		</div>
	);
}
