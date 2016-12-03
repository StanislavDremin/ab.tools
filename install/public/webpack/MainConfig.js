var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var EncodingPlugin = require('webpack-encoding-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
//http://stackoverflow.com/questions/31907672/how-to-set-multiple-file-entry-and-output-in-project-with-webpack
var MainConfig = function () {

	this.getConfig = function () {
		return {
			entry: {
				'ab/form.iblock/templates/.default/script': path.join(__dirname, '..', 'components','ab','form.iblock','app','app.js')
			},
			output: {
				path: path.resolve(__dirname, '..','components'),
				filename: "[name].js"
			},
			watch: true,
			watchOptions: {
				aggregateTimeout: 100
			},
			// context: path.join(__dirname),
			module: {
				loaders: [
					{
						test: /\.js$/,
						loader: "babel",
						exclude: [/node_modules/],
						includes: path.join(__dirname, 'local', 'components')
					},
					{
						test: /\.css$/,
						loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
					},
					{
						test: /\.sass$/,
						loader: ExtractTextPlugin.extract('style-loader', 'css-loader!resolve-url!sass-loader?sourceMap'),
					},
					{
						test: /\.gif$/,
						loader: "url-loader?limit=10000&mimetype=image/gif"
					},
					{
						test: /\.jpg$/,
						loader: "url-loader?limit=10000&mimetype=image/jpg"
					},
					{
						test: /\.png$/,
						loader: "url-loader?limit=10000&mimetype=image/png"
					},
					{
						test: /\.svg/,
						loader: "url-loader?limit=26000&mimetype=image/svg+xml"
					},
					{
						test: /\.jsx$/,
						loader: "react-hot!babel",
						exclude: [/node_modules/],
						includes: path.join(__dirname, 'local','components')
					},
					{
						test: /\.json$/,
						loader: "json-loader"
					}
				]
			},
			plugins: [
				new ExtractTextPlugin('styles.css', {
					allChunks: true
				}),
			],
			resolve: {
				root: [
					path.resolve(__dirname, 'node_modules'),
				]
			}
		};
	};
};

module.exports = new MainConfig();