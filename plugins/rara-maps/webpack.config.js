// webpack.config.js (CommonJS)

const path = require( 'path' );
const fs = require( 'fs' );
const { execFileSync, execSync } = require( 'child_process' );

const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const JsonMinimizerPlugin = require( 'json-minimizer-webpack-plugin' );

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

const dataDir = path.resolve( __dirname, 'data' );
const script = path.resolve( __dirname, 'scripts/compose.js' );
const tpl = path.resolve( dataDir, 'compose.hbs' );
const emittedAssetPath = 'data.json';

// ----------------- ComposeJsonPlugin (emit asset during compilation) -----------------
const ComposeJsonPlugin = {
	apply( compiler ) {
		const projectRoot = __dirname;

		compiler.hooks.thisCompilation.tap(
			'ComposeJsonPlugin',
			( compilation ) => {
				// ensure webpack watches the data directory (added to compilation context deps)
				compilation.contextDependencies.add( dataDir );

				// Use the processAssets stage after clean but before final emit
				const { RawSource } = webpack.sources;

				compilation.hooks.processAssets.tapPromise(
					{
						name: 'ComposeJsonPlugin',
						stage: webpack.Compilation
							.PROCESS_ASSETS_STAGE_ADDITIONS,
					},
					async () => {
						// temporary output file inside the build dir
						const tmpOut = path.resolve(
							projectRoot,
							'build',
							'.__data_temp.json'
						);

						try {
							console.log(
								'ComposeJsonPlugin: running compose.js …'
							);

							// ensure build dir exists so compose can write to tmpOut
							fs.mkdirSync( path.dirname( tmpOut ), {
								recursive: true,
							} );

							// Run compose.js with Node explicitly (avoids relying on shebang)
							execFileSync(
								process.execPath,
								[ script, tpl, tmpOut ],
								{ stdio: 'inherit' }
							);

							// read the generated content
							const content = fs.readFileSync( tmpOut );

							// emit as an asset under data/data.json
							compilation.emitAsset(
								emittedAssetPath,
								new RawSource( content )
							);

							// remove the temp file
							try {
								fs.unlinkSync( tmpOut );
							} catch ( err ) {
								// non-fatal
							}

							console.log(
								`ComposeJsonPlugin: emitted ${ emittedAssetPath }`
							);
						} catch ( err ) {
							// propagate the error so compilation fails visibly
							console.error(
								'ComposeJsonPlugin: failed to run compose.js',
								err
							);
							throw err;
						}
					}
				);
			}
		);
	},
};
// -------------------------------------------------------------------------------------

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
			? [
					new TerserPlugin( { extractComments: false } ),
					new JsonMinimizerPlugin(),
			  ]
			: [],
	},

	plugins: [
		ComposeJsonPlugin,
		new webpack.BannerPlugin( { banner } ),
		// Extract CSS in production
		...( ! isDev
			? [ new MiniCssExtractPlugin( { filename: 'bundle.css' } ) ]
			: [] ),
		// React Fast Refresh only in dev with HMR
		...( isDev && ReactRefreshWebpackPlugin
			? [ new ReactRefreshWebpackPlugin() ]
			: [] ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: path.resolve( __dirname, 'data/style.json' ),
					to: path.resolve( __dirname, 'build' ),
				},
			],
		} ),
	],

	devtool: minify ? false : 'eval-source-map',
	mode: minify ? 'production' : 'development',

	// Dev server for HMR
	...( isDev
		? {
				devServer: {
					static: [
						{
							directory: path.resolve( __dirname, 'assets' ),
							publicPath: '/assets',
						},
						{
							directory: path.resolve( __dirname, 'build' ),
							publicPath: '/build',
						},
						{
							directory: path.resolve( __dirname, 'data' ),
							publicPath: '/data',
						},
						{
							directory: path.resolve( __dirname, 'test' ),
							publicPath: '/',
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
