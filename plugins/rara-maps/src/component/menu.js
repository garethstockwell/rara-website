// Menu component

export class Menu {
	#elem;

	/**
	 * Create a Menu
	 */
	constructor() {
		this.#elem = document.getElementById( 'menu' );

		if ( this.#elem ) {
			const handleKeyDown = ( e ) => {
				if ( e.key === 'm' ) {
					this.#toggleVisible();
				}
			};

			document.addEventListener( 'keydown', handleKeyDown, true );
		}
	}

	/**
	 * Add a menu item
	 * @param {Object}   args         The arguments
	 * @param {string}   args.id      Layer identifier
	 * @param {string}   args.text    Text
	 * @param {Function} args.onclick Click handler
	 * @param {boolean}  args.active  Whether item is active
	 * @param {string}   args.color   Item color
	 */
	addItem( args ) {
		if ( this.#elem ) {
			const link = document.createElement( 'a' );
			link.id = `menu_${ args.id }`;
			link.layerId = args.id;
			link.href = '#';
			link.textContent = args.text;
			link.className = args.active ? 'active' : '';
			link.onclick = ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				link.className = args.onclick() ? 'active' : '';
			};

			const box = document.createElement( 'div' );
			box.className = 'box';
			box.style.backgroundColor = args.color ?? 'transparent';
			link.appendChild( box );

			this.#elem.appendChild( link );
			this.#show();
		}
	}

	#show() {
		this.#elem.hidden = false;
	}

	#toggleVisible() {
		console.debug( 'Menu.toggleVisible' );
		this.#elem.hidden = ! this.#elem.hidden;
	}
}
