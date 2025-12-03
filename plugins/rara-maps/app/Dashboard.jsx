import common from './common.module.css';
import styles from './Dashboard.module.css';

export default function Dashboard( { title, onClick } ) {
	function handleClick() {
		if ( onClick ) {
			onClick();
		}
	}

	return (
		<div
			className={ `${ common.card } ${ styles.dashboard }` }
			onClick={ handleClick }
		>
			<p>{ title }</p>
		</div>
	);
}
