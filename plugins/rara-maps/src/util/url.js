// URL-mangling utilities

const PLACEHOLDER = '%{PLUGIN}';

export function absUrl( url ) {
	if ( url.startsWith( PLACEHOLDER ) ) {
		return raraMapsData.baseUrl + url.slice( PLACEHOLDER.length );
	}
	return url;
}
