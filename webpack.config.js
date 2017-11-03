var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        app: './assets/src/client.tsx'
    },
    output: {
        filename: '[name].js',
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
                    use: "css-loader!sass-loader"
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
        new ExtractTextPlugin("app.css"),
        new UglifyJSPlugin({ sourceMap: true })
    ],


    // in production, use just "source-map"
    devtool: "source-map"
}