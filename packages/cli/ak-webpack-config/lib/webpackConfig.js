const path = require('path');

/** @typedef  {import('webpack').Configuration} webpackOptions*/

/** @implements {webpackOptions} */
class WebpackConfig {
    constructor() {
        // default context, make loader resolve relative to it
        /** @type {webpackOptions['context']} */
        this.context = path.resolve(__dirname, '../../');
        /** @type {webpackOptions['mode']} */
        this.mode = 'production';
        /** @type {webpackOptions['optimization']} */
        this.optimization = undefined;
        /** @type {webpackOptions['entry']} */
        this.entry = undefined;
        /** @type {webpackOptions['output']} */
        this.output = undefined;
        /** @type {webpackOptions['resolve']} */
        this.resolve = undefined;
        /** @type {webpackOptions['resolveLoader']} */
        this.resolveLoader = undefined;
        /** @type {webpackOptions['module']} */
        this.module = undefined;
        /** @type {webpackOptions['devtool']} */
        this.devtool = false;
        /** @type {webpackOptions['plugins']} */
        this.plugins = undefined;
        /** @type {webpackOptions['externals']} */
        this.externals = {};
        /** @type {webpackOptions['performance']} */
        this.performance = {};
    }
}

module.exports = WebpackConfig;
