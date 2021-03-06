const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		helloWorld: './src/hello-world.js',
		chrono: './src/chrono.js'
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '/static/'
	},
	mode: 'production',
	optimization: {
		splitChunks: {
			chunks: 'all',
			minSize: 10000,
			automaticNameDelimiter: '_'
		}
	},
	module: {
		rules: [
			{
				test: /\.(png|jpg)$/,
				use: [ 'file-loader' ]
			},
			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
								return [ require('precss'), require('autoprefixer') ]
							}
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/env' ],
						plugins: [ 'transform-class-properties' ]
					}
				}
			},
			{
				test: /\.hbs$/,
				use: [ 'handlebars-loader' ]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css'
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: 'hello-world.html',
			chunks: [
				'helloWorld',
				'vendors_chrono_helloWorld',
				'vendors_helloWorld'
			],
			title: 'Hello world HBS',
			template: 'src/page-template.hbs',
			description: 'some description'
		}),
		new HtmlWebpackPlugin({
			filename: 'chrono.html',
			chunks: [ 'chrono', 'vendors_chrono_helloWorld' ],
			title: 'chrono',
			template: 'src/page-template.hbs',
			description: 'chrono'
		})
	]
}
