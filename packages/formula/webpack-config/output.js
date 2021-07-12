
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;

const isDevelopment = NODE_ENV === 'development';

module.exports = {
    filename: isDevelopment ? 'js/build.js' : 'js/build.[contenthash:10].js',
    path: path.resolve(__dirname, '../react-blogs-build'),
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:10].js'
};