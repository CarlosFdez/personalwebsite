// note: webpack is using the tsconfig in assets/tsconfig.json
// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html

module.exports = {
    entry: {
        app: './assets/src/client.tsx',
        polyfill: 'babel-polyfill'
    },

    output: {
        filename: '[name].js',
        path: __dirname + '/assets/build/',
        publicPath: '/assets/build'
    },

    resolve: {
        extensions: ['.js', '.json', '.ts', '.jsx', '.tsx']
    },

    module: {
        rules: [
            {
                // typescript gets compiled. babel-loader is required for HMR.
                test: /\.(ts|tsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                // all fonts dumped as is (with hash appended)
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },
}