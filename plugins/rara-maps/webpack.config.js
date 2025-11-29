import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';

import webpack from 'webpack';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

function getCommitHash() {
	const status = execSync( 'git status --porcelain' )
		.toString( 'utf8' )
		.trim();
	let commit = execSync( 'git rev-parse HEAD' ).toString( 'utf8' ).trim();
	if ( status !== '' ) {
		commit = commit + '-dirty';
	}
	return commit;
}

const minify = process.env.WEBPACK_MINIFY === '1';
const commit = getCommitHash();

console.log( 'minify:', minify );
console.log( 'commit:', commit );

const baseConfig = {
	entry: resolve( __dirname, 'src/index.js' ),
	output: {
		filename: 'bundle.js',
		path: resolve( __dirname, 'build' ),
		library: {
			name: 'raraMaps', // create a dictionary of exports called raraMaps
			type: 'window', // attach the dictionary to window
		},
	},
	experiments: {
		outputModule: true,
	},
	plugins: [
		new webpack.BannerPlugin( {
			banner: `Built from commit: ${ commit }`,
			entryOnly: true,
		} ),
	],
};

const prodConfig = {
	mode: 'production',
};

const devConfig = {
	devtool: false,
	mode: 'development',
};

const mainConfig = minify
	? {
			...baseConfig,
			...prodConfig,
	  }
	: {
			...baseConfig,
			...devConfig,
	  };

export default mainConfig;
