'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ArchivePlugin = require('webpack-archive-plugin');

const isDev = false;

module.exports = {
    cache: true,
    entry: "./src/index",
    output: {
        path: __dirname + '/app/',
        filename: "activeQueryBuilder.js",
        library: "ActiveQueryBuilder"
    },
    watch: isDev,
    devtool: isDev ? '#cheap-module-eval-source-map' : null,
	node: {
		fs: "empty"
	},
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
				query: {
                    cacheDirectory: true,
                    presets: [ 'es2015', 'stage-0', 'react' ]
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("css!autoprefixer!resolve-url!sass?sourceMap")
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                loader: 'file?name=./img/[name].[ext]?[hash]'
            }
        ]
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        proxy: [
            {
                path: /.*/,
                target: 'http://localhost:54459'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify( isDev ? 'development' : 'production')
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.NoErrorsPlugin()
    ]
};

if(!isDev) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
                dead_code: true,
                drop_console: true,
                drop_debugger: true
            }
        })
    );
    module.exports.plugins.push(new ArchivePlugin({
        format: 'zip'
    }));
}
