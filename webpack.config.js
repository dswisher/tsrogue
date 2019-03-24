const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
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
        extensions: [ '.ts' ]
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
    }
};
