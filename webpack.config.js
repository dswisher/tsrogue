const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000
    },
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
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
            { from: './assets/human.png' },
            { from: './assets/favicon.ico' }
        ])
    ]
};
