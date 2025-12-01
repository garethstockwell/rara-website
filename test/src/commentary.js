// Commentary component

export class Commentary {
	#elems;
	#elemIds;
	#index;
	#activeId;
	#prevButtons;
	#prevLabels;
	#nextButtons;
	#nextLabels;
	#callback;

	/**
	 * Construct a Commentary object
	 * @param {Object}   args          The arguments
	 * @param {Function} args.callback Callback function
	 */
	constructor( args ) {
		this.#elems = document.querySelectorAll( '.commentary-panel' );
		this.#elems.forEach( ( el ) => ( el.classList.add( 'hidden' ) ) );
		this.#elemIds = Array.from( this.#elems ).map( ( el ) => el.id );

		this.#index = 0;
		this.#activeId = this.#elemIds[ this.#index ];

		this.#prevButtons = document.querySelectorAll( '.prev-button' );
		this.#prevLabels = document.querySelectorAll( '.prev-label' );
		this.#nextButtons = document.querySelectorAll( '.next-button' );
		this.#nextLabels = document.querySelectorAll( '.next-label' );

		this.#prevButtons.forEach( ( el ) =>
			el.addEventListener( 'click', ( event ) => {
				this.#onPrev();
				event.stopPropagation();
			} )
		);
		this.#nextButtons.forEach( ( el ) =>
			el.addEventListener( 'click', ( event ) => {
				this.#onNext();
				event.stopPropagation();
	 		} )
		);

		this.#callback = args.callback;
	}

	/**
	 * Get commentary identifiers
	 */
	get ids() {
		return this.#elemIds;
	}

	/**
	 * Set active identifier
	 * @param {number} index Index of identifier
	 */
	setIndex( index ) {
		const oldId = this.#activeId;
		this.#index = index;
		this.#activeId = this.#elemIds[ this.#index ];

		console.debug(
			`Commentary.setIndex ${ oldId } -> ${ index } ${ this.#activeId }`
		);

		const oldElem = document.querySelector( '#' + oldId );
		oldElem.classList.add( 'hidden' );

		const newElem = document.querySelector( '#' + this.#activeId );
		newElem.classList.remove( 'hidden' );

		if ( this.#index > 0 ) {
			this.#prevButtons.forEach(
				( el ) => ( el.style.visibility = 'visible' )
			);
			this.#prevLabels.forEach(
				( el ) =>
					( el.textContent = document
						.querySelector( '#' + this.#elemIds[ this.#index - 1 ] )
						.querySelector( 'h1' ).textContent )
			);
		} else {
			this.#prevButtons.forEach(
				( el ) => ( el.style.visibility = 'hidden' )
			);
		}

		if ( this.#index + 1 < this.#elemIds.length ) {
			this.#nextButtons.forEach(
				( el ) => ( el.style.visibility = 'visible' )
			);
			this.#nextLabels.forEach(
				( el ) =>
					( el.textContent = document
						.querySelector( '#' + this.#elemIds[ this.#index + 1 ] )
						.querySelector( 'h1' ).textContent )
			);
		} else {
			this.#nextButtons.forEach(
				( el ) => ( el.style.visibility = 'hidden' )
			);
		}

		if ( this.#callback ) {
			this.#callback( oldId, this.#activeId );
		}
	}

	#onPrev() {
		this.setIndex(
			( this.#index - 1 + this.#elemIds.length ) % this.#elemIds.length
		);
	}

	#onNext() {
		this.setIndex( ( this.#index + 1 ) % this.#elemIds.length );
	}
}
