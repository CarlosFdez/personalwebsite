const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: "source-map",
    mode: 'production',
    output: {
        filename: '[name].js?[chunkhash]'
    },
    module: {
        rules: [
            {
                // all imported scss gets parsed then redirected to the plugin
                test: /\.(scss|sass|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin("app.css?[chunkhash]"),
        new ManifestPlugin({ fileName: '../webpack-manifest.json' })
    ]
});

console.log(module.exports)