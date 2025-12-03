// webpack.config.js (CommonJS)

const path = require( 'path' );
const { execSync } = require( 'child_process' );

const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

// react-refresh plugin is optional (only used in dev)
let ReactRefreshWebpackPlugin;
try {
	ReactRefreshWebpackPlugin = require( '@pmmmwh/react-refresh-webpack-plugin' );
} catch ( err ) {
	ReactRefreshWebpackPlugin = null;
}

function getCommitHash() {
	const status = execSync( 'git status --porcelain' )
		.toString( 'utf8' )
		.trim();
	let commit = execSync( 'git rev-parse HEAD' ).toString( 'utf8' ).trim();
	if ( status !== '' ) {
		commit += '-dirty';
	}
	return commit;
}

const minify = process.env.WEBPACK_MINIFY === '1';
const isDev = process.env.NODE_ENV === 'development' && ! minify;
const commit = getCommitHash();
const banner = `Built from commit: ${ commit }`;

console.log( 'minify:', minify );
console.log( 'isDev:', isDev );
console.log( 'commit:', commit );

// Entry file
const entryFile = path.resolve( __dirname, 'index.jsx' );

const baseConfig = {
	entry: entryFile,
	output: {
		filename: 'bundle.js',
		path: path.resolve( __dirname, 'build' ),
		library: {
			name: 'raraMaps',
			type: 'window',
		},
		clean: true,
	},

	resolve: {
		extensions: [ '.js', '.jsx' ],
	},

	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[ '@babel/preset-env', { targets: 'defaults' } ],
							[ '@babel/preset-react', { runtime: 'automatic' } ],
						],
						plugins: [],
					},
				},
			},

			// CSS Modules
			{
				test: /\.module\.css$/i,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: isDev
									? '[path][name]__[local]'
									: '[hash:base64]',
							},
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: { plugins: [ [ 'autoprefixer' ] ] },
						},
					},
				],
			},

			// Global CSS
			{
				test: /\.css$/i,
				exclude: /\.module\.css$/i,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: { plugins: [ [ 'autoprefixer' ] ] },
						},
					},
				],
			},
		],
	},

	optimization: {
		minimize: minify,
		minimizer: minify
			? [ new TerserPlugin( { extractComments: false } ) ]
			: [],
	},

	plugins: [
		new webpack.BannerPlugin( { banner } ),
		// Extract CSS in production
		...( ! isDev
			? [ new MiniCssExtractPlugin( { filename: 'bundle.css' } ) ]
			: [] ),
		// React Fast Refresh only in dev with HMR
		...( isDev && ReactRefreshWebpackPlugin
			? [ new ReactRefreshWebpackPlugin() ]
			: [] ),
	],

	devtool: minify ? false : 'eval-source-map',
	mode: minify ? 'production' : 'development',

	// Dev server for HMR
	...( isDev
		? {
				devServer: {
					static: [
						{
							directory: path.resolve( __dirname, 'test' ),
							publicPath: '/',
						},
						{
							directory: path.resolve( __dirname, 'lib' ),
							publicPath: '/lib',
						},
						{
							directory: path.resolve( __dirname, 'map' ),
							publicPath: '/map',
						},
					],
					hot: true,
					port: 3000,
				},
		  }
		: {} ),
};

// Add react-refresh/babel plugin only if HMR is enabled
if ( isDev && ReactRefreshWebpackPlugin ) {
	const babelRule = baseConfig.module.rules.find(
		( r ) => r.use && r.use.loader === 'babel-loader'
	);
	if ( babelRule ) {
		babelRule.use.options.plugins = (
			babelRule.use.options.plugins || []
		).concat( [ require.resolve( 'react-refresh/babel' ) ] );
	}
}

module.exports = baseConfig;
