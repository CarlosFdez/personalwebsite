// note: webpack is using the tsconfig in assets/tsconfig.json
// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = function (params) {
    var env = params.mode || 'development';
    var isProduction = (env == 'production');
    console.log("Webpack generated in " + env + " mode (isProduction is " + isProduction + ")");

    if (isProduction)
    {
        process.env.NODE_ENV = 'production';
    }

    function makeHot(entry) {
        if (isProduction) {
            return entry;
        } else {
            return ['webpack-hot-middleware/client', entry];
        }
    }

    return {
        mode: env,
        devtool: (isProduction) ? 'source-map' : 'inline-source-map',

        entry: {
            app: makeHot('./assets/src/client.tsx'),
            polyfill: 'babel-polyfill'
        },

        output: {
            filename: '[name].js',
            path: __dirname + '/assets/build/',
            publicPath: '/assets/build/'
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
                },
                {
                    // CSS files (with HMR enabled if dev)
                    test:  /\.(css|scss)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: !isProduction
                            }
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },

        plugins: (
            (isProduction) ? [
                // production plugins
                new CleanWebpackPlugin(),
                new ManifestPlugin({ 
                    fileName: '../webpack-manifest.json'
                    // todo: consider adding basePath and forcing the app to include assets/build in their path
                }),
                new MiniCssExtractPlugin({
                    filename: '[name].[hash].css',
                    chunkFilename: '[id].[hash].css'
                })
            ] : [
                // not production plugins
                new webpack.HotModuleReplacementPlugin(),
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                    chunkFilename: '[id].css'
                })
            ]
        )
    };
};