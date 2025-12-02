import styles from './App.module.css';
import Panel from './Panel.jsx';

export default function App( { footer } ) {
	return (
		<div className={ styles.app }>
			<h3>Hello from React!</h3>
			<p>This component is embedded inside a non-React page.</p>

			<Panel footer={ footer } />
		</div>
	);
}
