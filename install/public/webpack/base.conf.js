import path from 'path';
import env from './nodeEnv';
import webpack from 'webpack';
import ExtractTextPlugin from "extract-text-webpack-plugin";

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');

const config = {
	context: path.resolve(__dirname, '..', 'local'),
	resolve: {
		root: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve('..', 'local', 'modules', 'ab.tools', 'asset', 'js'),
			path.resolve('..', 'local', 'dist', 'libs', 'js'),
		],
		modulesDirectories: [path.resolve(__dirname, 'node_modules')],
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
	},
	entry: {},
	output: {},
	/*entry: {
	 'dist/js/application.js': path.resolve(__dirname, '..', 'local', 'src', 'app.js')
	 },
	 output: {
	 path: path.resolve(__dirname, '..', 'local'),
	 publicPath: '../local/',
	 filename: "[name]"
	 },*/

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: path.resolve(__dirname, 'node_modules', 'babel-loader'),
				exclude: [/node_modules/],
				// include: [
				// 	path.resolve(__dirname, 'node_modules', 'babel-loader'),
				// ],
				query: {
					// https://github.com/babel/babel-loader#options
					cacheDirectory: isDebug,

					// https://babeljs.io/docs/usage/options/
					babelrc: false,
					presets: [
						// Latest stable ECMAScript features
						// https://github.com/babel/babel/tree/master/packages/babel-preset-latest
						path.resolve(__dirname, 'node_modules', 'babel-preset-latest'),

						// 'latest',
						// Experimental ECMAScript proposals
						// https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0
						path.resolve(__dirname, 'node_modules', 'babel-preset-stage-0'),
						// 'stage-0',
						// JSX, Flow
						// https://github.com/babel/babel/tree/master/packages/babel-preset-react
						path.resolve(__dirname, 'node_modules', 'babel-preset-react'),
						// 'react',
						...isDebug ? [] : [
							// Optimize React code for the production build
							// https://github.com/thejameskyle/babel-react-optimize
							path.resolve(__dirname, 'node_modules', 'babel-preset-react-optimize'),
							// 'react-optimize',
						],
					],
					plugins: [
						// Externalise references to helpers and builtins,
						// automatically polyfilling your code without polluting globals.
						// https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime
						path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-runtime'),
						// 'transform-runtime',
						...!isDebug ? [] : [
							// Adds component stack to warning messages
							// https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
							path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-react-jsx-source'),
							// 'transform-react-jsx-source',
							// Adds __self attribute to JSX which React will use for some warnings
							// https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
							path.resolve(__dirname, 'node_modules', 'babel-plugin-transform-react-jsx-self'),
							// 'transform-react-jsx-self',
						],
					],
				},
			},
			{
				test: /\.css/,
				loaders: [
					path.resolve(__dirname, 'node_modules', 'isomorphic-style-loader'),
					`css-loader?${JSON.stringify({
						// CSS Loader https://github.com/webpack/css-loader
						importLoaders: 1,
						sourceMap: isDebug,
						// CSS Modules https://github.com/css-modules/css-modules
						modules: true,
						localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
						// CSS Nano http://cssnano.co/options/
						minimize: !isDebug,
						discardComments: {removeAll: true},
					})}`,
					path.resolve(__dirname, 'node_modules', 'postcss-loader') + '?pack=default',
					// 'postcss-loader?pack=default',
				],
			},
			{
				test: /\.json$/,
				loader: path.resolve(__dirname, 'node_modules', 'json-loader'),
				// loader: 'json-loader',
			},
			{
				test: /\.txt$/,
				loader: path.resolve(__dirname, 'node_modules', 'raw-loader'),
				// loader: 'raw-loader',
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				loader: path.resolve(__dirname, 'node_modules', 'file-loader'),
				// loader: 'file-loader',
				query: {
					name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
				},
			},
			{
				test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
				loader: path.resolve(__dirname, 'node_modules', 'url-loader'),
				// loader: 'url-loader',
				query: {
					name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
					limit: 10000,
				},
			},
		],
	},


	// Don't attempt to continue if there are any errors.
	bail: !isDebug,

	cache: isDebug,
	debug: isDebug,

	stats: {
		colors: true,
		reasons: isDebug,
		hash: isVerbose,
		version: isVerbose,
		timings: true,
		chunks: isVerbose,
		chunkModules: isVerbose,
		cached: isVerbose,
		cachedAssets: isVerbose,
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 300
	},

	// The list of plugins for PostCSS
	// https://github.com/postcss/postcss
	postcss(bundler) {
		return {
			default: [
				// Transfer @import rule by inlining content, e.g. @import 'normalize.css'
				// https://github.com/jonathantneal/postcss-partial-import
				require('postcss-partial-import')({addDependencyTo: bundler}),
				// Allow you to fix url() according to postcss to and/or from options
				// https://github.com/postcss/postcss-url
				require('postcss-url')(),
				// W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
				// https://github.com/postcss/postcss-custom-properties
				require('postcss-custom-properties')(),
				// W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
				// https://github.com/postcss/postcss-custom-media
				require('postcss-custom-media')(),
				// CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
				// https://github.com/postcss/postcss-media-minmax
				require('postcss-media-minmax')(),
				// W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
				// https://github.com/postcss/postcss-custom-selectors
				require('postcss-custom-selectors')(),
				// W3C calc() function, e.g. div { height: calc(100px - 2em); }
				// https://github.com/postcss/postcss-calc
				require('postcss-calc')(),
				// Allows you to nest one style rule inside another
				// https://github.com/jonathantneal/postcss-nesting
				require('postcss-nesting')(),
				// Unwraps nested rules like how Sass does it
				// https://github.com/postcss/postcss-nested
				require('postcss-nested')(),
				// W3C color() function, e.g. div { background: color(red alpha(90%)); }
				// https://github.com/postcss/postcss-color-function
				require('postcss-color-function')(),
				// Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
				// https://github.com/iamvdo/pleeease-filters
				require('pleeease-filters')(),
				// Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
				// https://github.com/robwierzbowski/node-pixrem
				require('pixrem')(),
				// W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
				// https://github.com/postcss/postcss-selector-matches
				require('postcss-selector-matches')(),
				// Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
				// https://github.com/postcss/postcss-selector-not
				require('postcss-selector-not')(),
				// Postcss flexbox bug fixer
				// https://github.com/luisrudge/postcss-flexbugs-fixes
				require('postcss-flexbugs-fixes')(),
				// Add vendor prefixes to CSS rules using values from caniuse.com
				// https://github.com/postcss/autoprefixer
				require('autoprefixer')({
					browsers: [
						'>1%',
						'last 4 versions',
						'Firefox ESR',
						'not ie < 9', // React doesn't support IE8 anyway
					],
				}),
			],
		};
	},

	plugins: [
		new ExtractTextPlugin('styles.css', {
			allChunks: true
		}),
		new webpack.EnvironmentPlugin("NODE_ENV")
	],
};

if(env != 'production' || env != 'prod'){
	config.watch = true;
	config.watchOptions = {
		aggregateTimeout: 300
	};
}
if(env == 'production' || env == 'prod'){
	config.watch = false;
	if(config.plugins === undefined){
		config.plugins = [];
	}
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false,
			drop_console: true,
			unsafe: true
		}
	}));
}

export default config;
