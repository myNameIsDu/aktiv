const path = require('path');

/** @typedef {import('webpack').Configuration} WebpackOptions*/
/** @typedef {import('webpack').ResolveOptions} ResolveType*/
/** @typedef {import('webpack').ModuleOptions} ModuleType*/
module.exports = {
    entry: {
        type: ['object', 'array', 'string'],
        default: (/** @type {string} */ workDir) => path.resolve(workDir, './src/index'),
    },
    output: {
        type: ['object', 'string'],
        default: (/** @type {string} */ workDir) => {
            /** @type {NonNullable<WebpackOptions['output']>} */
            const output = {
                filename: 'js/[name].js',
                path: path.resolve(workDir, './dist'),
                publicPath: '/',
                chunkFilename: 'js/[name].js',
                clean: true,
                crossOriginLoading: 'anonymous',
                hashDigestLength: 10,
            };

            return output;
        },
    },
    module: {
        // type: 'object',
        default: () => {
            /** @type {ModuleType} */
            const defaultModule = {
                rules: [],
            };

            return defaultModule;
        },
    },
    resolve: {
        // type: 'object',
        default: (/** @type {string} */ workDir) => {
            /** @type {ResolveType} */
            const resolve = {
                alias: {
                    src: path.resolve(workDir, 'src/'),
                },
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            };

            return resolve;
        },
    },
    resolveLoader: {
        // type: 'object',
        default() {
            /** @type {ResolveType} */
            const resolveLoader = {
                modules: [
                    'node_modules',
                    path.resolve(__dirname, '../../node_modules'), // for customized loader installed in project
                ],
            };

            return resolveLoader;
        },
    },
    plugins: {
        // type: 'array',
        default() {
            return [];
        },
    },
};
