var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './assets/src/app.js'
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
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                // all imported css gets redirected to the extract text
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
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
        new ExtractTextPlugin("app.css")
    ],


    devtool: "source-map"
}