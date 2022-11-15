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
                modules: [
                    'node_modules',
                    path.resolve(__dirname, '../../node_modules'), // 兼容 core-js 包 和 swc/helper 路径问题
                    path.resolve(__dirname, '../../../../../node_modules'), // 兼容 pnpm 结构
                ],
            };

            return resolve;
        },
    },
    resolveLoader: {
        // type: 'object',
        default() {
            /** @type {ResolveType} */
            const resolveLoader = {
                modules: ['node_modules'],
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
