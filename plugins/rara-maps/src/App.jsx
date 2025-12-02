import styles from './App.module.css';
import Panel from './Panel.jsx';

export default function App() {
	return (
		<div className={ styles.root }>
			<h3>Hello from React!</h3>
			<p>This component is embedded inside a non-React page.</p>
			<Panel />
		</div>
	);
}
