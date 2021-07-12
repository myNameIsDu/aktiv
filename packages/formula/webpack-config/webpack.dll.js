const path = require('path');
const Webpack = require('webpack');


module.exports = {
    mode: 'production',
    entry: {
        vendor: ['react', 'react-dom', 'react-router', 'react-router-dom', 'react-quill', 'moment']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]_[hash:10]'
    },
    plugins: [
        new Webpack.DllPlugin({
            name: '[name]_[hash:10]',
            path: path.resolve(__dirname, '../dll/manifest.json')
        })
    ]
    
};