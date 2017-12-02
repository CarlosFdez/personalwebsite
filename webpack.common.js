var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

var autoprefixer = require('autoprefixer');

// note: webpack is using the tsconfig in assets/tsconfig.json

module.exports = {
    entry: {
        app: './assets/src/client.tsx'
    },

    output: {
        filename: '[name].js?[chunkhash]',
        path: __dirname + '/assets/build/'    
    },

    resolve: {
        extensions: ['.js', '.json', '.ts', '.jsx', '.tsx']
    },

    module: {
        rules: [
            {
                // typescript gets compiled
                test: /\.(ts|tsx)$/,
                use: 'ts-loader'
            },
            {
                // all imported css gets redirected to the plugin
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                // all imported scss gets parsed then redirected to the plugin
                test: /\.(scss|sass)$/, 
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    autoprefixer
                                ]
                            }
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                })
            },
            {
                // all fonts dumped as is (with hash appended)
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("app.css?[chunkhash]"),
        new UglifyJSPlugin({ sourceMap: true }),
        new ManifestPlugin({ fileName: '../webpack-manifest.json' })
    ]
}