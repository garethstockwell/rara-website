// webpack.config.js (CommonJS)

const path = require('path');
const { execSync } = require('child_process');

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// react-refresh plugin is optional (only used in dev). Try to require it.
let ReactRefreshWebpackPlugin;
try {
  ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
} catch (err) {
  // not installed — we'll simply not enable fast refresh
  ReactRefreshWebpackPlugin = null;
}

function getCommitHash() {
  const status = execSync('git status --porcelain').toString('utf8').trim();
  let commit = execSync('git rev-parse HEAD').toString('utf8').trim();
  if (status !== '') commit = commit + '-dirty';
  return commit;
}

const minify = process.env.WEBPACK_MINIFY === '1';
const isDev = process.env.NODE_ENV === 'development' && !minify;
const commit = getCommitHash();
const banner = `Built from commit: ${commit}`;

console.log('minify:', minify);
console.log('isDev:', isDev);
console.log('commit:', commit);

// Entry — change to index.js if you prefer
const entryFile = path.resolve(__dirname, 'index.jsx');

const baseConfig = {
  entry: entryFile,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    library: {
      name: 'raraMaps',
      type: 'window',
    },
  },

  resolve: {
    extensions: ['.js', '.jsx'],
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
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [],
          },
        },
      },
      // add other loaders (css, images) here if needed
    ],
  },

  optimization: {
    minimize: minify,
    minimizer: minify
      ? [
          new TerserPlugin({
            extractComments: false,
          }),
        ]
      : [],
  },

  plugins: [new webpack.BannerPlugin({ banner })],

  devtool: minify ? false : 'eval-source-map',
  mode: minify ? 'production' : 'development',
};

if (isDev && ReactRefreshWebpackPlugin) {
  baseConfig.plugins.push(new ReactRefreshWebpackPlugin());

  // add react-refresh/babel plugin to babel-loader options
  const babelRule = baseConfig.module.rules.find((r) => r.use && r.use.loader === 'babel-loader');
  if (babelRule) {
    babelRule.use.options.plugins = (babelRule.use.options.plugins || []).concat([
      require.resolve('react-refresh/babel'),
    ]);
  }
}

module.exports = baseConfig;
