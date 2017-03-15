const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	target: 'node',
	entry:{
		Index: path.resolve(__dirname, 'Client/src/Index/Index.jsx'),
		Login: path.resolve(__dirname, 'Client/src/Login/Login.jsx'),
	},
	output:{
		filename: '[name].js',  
		path: path.resolve(__dirname, 'Client/build')
	},
	module: {
		rules: [
			{
				test: /\.css$/, 
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			}, 
			{
				test: /\.(jsx)$/, 
				loader: 'babel-loader', 
				query: {
					presets: [
						'es2015', 
						'react', 
						'babel-preset-stage-0'
					]
				}
			},
			{ 
				test: /\.(jpg|eot|png|woff|woff2|ttf|svg)$/,
				loader: "url-loader" 
			},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		}),
		new ExtractTextPlugin("styles.css")
	]
};
