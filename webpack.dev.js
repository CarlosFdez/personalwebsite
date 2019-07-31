const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

// Fixes webpack-dev-middleware multiple compilation bug on some platforms
const TimeFixPlugin = require('time-fix-plugin')

module.exports = merge(common, {
    devtool: "inline-source-map",
    entry: {
        app: [
            './assets/src/client.tsx', 
            'webpack-hot-middleware/client'
        ],
        polyfill: 'babel-polyfill'
    },
    mode: 'development',
    devServer: {
        hot: 'true'
    },
    module: {
        rules: [
            {
                // all imported scss gets parsed then redirected to the plugin
                test: /\.(scss|sass|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new TimeFixPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
});