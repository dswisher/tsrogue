const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000,
        watchOptions: {
            ignored: /node_modules/
        }
    },
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {
                            failOnHint: true
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    performance: {
        maxAssetSize: 726875
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    output: {
        filename: 'tsrogue.js',
        library: 'tsrogue',
        libraryTarget: 'var',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        concatenateModules: false,
        namedModules: true,
        namedChunks: true,
        minimize: false
    },
    plugins: [
        new CopyPlugin([
            { from: './index.html' },
            { from: './assets/rltiles-2d.json' },
            { from: './assets/rltiles-2d.png' },
            { from: './assets/favicon.ico' }
        ])
    ]
};
