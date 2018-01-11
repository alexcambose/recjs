const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dist.js',
        library: '',
        libraryTarget: 'commonjs'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin()
    ]
};
