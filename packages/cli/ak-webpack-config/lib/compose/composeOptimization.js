const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { browserTarget } = require('../../../config/index');

const defaultVendorPaths = [
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'moment',
    'lodash',
    'redux',
    'axios',
];

function inArray(arr, target) {
    return arr.reduce((result, item) => {
        if (target.indexOf(item) >= 0) {
            result = true;
        }

        return result;
    }, false);
}

/** @typedef  {import('../../../config/index').TargetListType[number]} TargetType*/
/** @typedef {import('webpack').Configuration['optimization']} OptimizationType */
/** @typedef {import('webpack').NormalModule} NormalModuleType */

/**
 * @param {TargetType} target target
 * @param {Array<string> | string } splitChunksVendor splitChunksVendor
 * @param {Record<string,any>} splitChunksCacheGroups splitChunksCacheGroups
 * @param {Record<string,any>} terserPluginOptions terserPluginOptions
 * @param {Record<string,any>} CssMinimizerPluginOptions CssMinimizerPluginOptions
 * @returns {OptimizationType} Optimization
 */
function composeOptimization(
    target,
    splitChunksVendor,
    splitChunksCacheGroups,
    terserPluginOptions,
    CssMinimizerPluginOptions,
) {
    /** @type {OptimizationType} */
    const optimization = {};

    const vendorPaths = splitChunksVendor
        ? defaultVendorPaths.concat(splitChunksVendor)
        : defaultVendorPaths;

    if (target === browserTarget) {
        optimization.splitChunks = {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    /**
                     * @param {NormalModuleType} module module
                     * @return {boolean} return
                     */
                    test(module) {
                        return module.resource && inArray(vendorPaths, module.resource);
                    },
                    priority: -10,
                    reuseExistingChunk: true,
                },
                ...splitChunksCacheGroups,
            },
        };
        optimization.runtimeChunk = {
            name: entrypoint => `runtime-${entrypoint.name}`,
        };
        optimization.minimizer = [
            // Remove the comment as it is extracted by default
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
                ...terserPluginOptions,
            }),
            new CssMinimizerWebpackPlugin(
                CssMinimizerPluginOptions ? { ...CssMinimizerPluginOptions } : undefined,
            ),
        ];
    }

    return optimization;
}

module.exports = composeOptimization;
