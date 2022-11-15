const MintCssExtractWebpackPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const {
    composeEntry,
    composeOutput,
    composePerformance,
    composeLoaders,
    composeResolve,
    composeResolveLoader,
    composePlugins,
    composeOptimization,
    composeRulesOptions,
} = require('./lib/compose/index');
const babelLoader = require('./lib/loaders/babelLoader');
const defaultLoaders = require('./lib/loaders/defaultLoaders');
const styleLoaders = require('./lib/loaders/styleLoaders');
const parseExternalConfig = require('./lib/parseExternalConfig');
const defaultPlugins = require('./lib/plugins/defaultPlugins');
const WebpackConfig = require('./lib/webpackConfig');
const { browserTarget } = require('../config/index');

/** @typedef  {import('../config/index').TargetListType[number]} TargetType*/
/** @typedef  {import('../config/index').EnvListType[number]} EnvType*/
/** @typedef  {import('./presets/index').PresetItemType} PresetItemType*/
/** @typedef  {import('webpack').Configuration} WebpackOptions*/
/** @typedef  {import('@sentry/webpack-plugin').SentryCliPluginOptions} SentryCliPluginOptions */
/** @typedef  {import('./lib/parseExternalConfig').URIType} URIType */
/** @typedef  {import('html-webpack-plugin').Options} HtmlWebpackPluginOptions */
/** @typedef  {import('moment-timezone-data-webpack-plugin').Options} miniMomentTimezone*/
/** @typedef  {import('webpack').RuleSetRule} RuleSetRule*/
/** @typedef  {import('webpack').Configuration['resolve']} ResolveOptions*/
/** @typedef  {import('webpack').Configuration['externals']} Externals */
/** @typedef  {import('webpack').Configuration['plugins']} Plugins*/
/** @typedef  {import('webpack').Configuration['externalsType']} ExternalsType*/
// eslint-disable-next-line max-len
/** @typedef  {import('@pmmmwh/react-refresh-webpack-plugin/types/lib/types').ReactRefreshPluginOptions} ReactRefreshPluginOptions*/

/**
 * @typedef  {Object} akConfig
 * @property {SentryCliPluginOptions=} sentry sentryConfig
 * @property {{externalScripts?:URIType[], externalStylesheets?:URIType[]} & HtmlWebpackPluginOptions} html html
 * @property {{localesToKeep:string[], ignoreInvalidLocales:boolean}|boolean} miniMomentLocales
 * @property {miniMomentTimezone | boolean} miniMomentTimezone
 * @property {string|string[]|Record<string,string>} entry
 * @property {string} workDir
 * @property {WebpackOptions['output']|string} output
 * @property {string[]} babelInclude
 * @property {boolean|Record<string, any>} svgSprite
 * @property {RuleSetRule|RuleSetRule[]} loaders
 * @property {ResolveOptions} resolve
 * @property {ResolveOptions} resolveLoader
 * @property {Externals} externals
 * @property {string} appPath
 * @property {string} appName
 * @property {Record<string,any>} definitions
 * @property {string} staticSourcePath
 * @property {string} toCopyPath
 * @property {Plugins} plugins
 * @property {Array<string> | string} splitChunksVendor
 * @property {Record<string,any>} splitChunksCacheGroups
 * @property {Record<string,any>}  terserPluginOptions
 * @property {Record<string,any>} CssMinimizerPluginOptions
 * @property {Record<string,any>} loaderQueries
 * @property {string} devtool
 * @property {any} pkg
 * @property {boolean} analyze
 * @property {PresetItemType} presets
 * @property {TargetType} target
 * @property {ExternalsType} externalsType
 * @property {ReactRefreshPluginOptions} reactRefreshPluginOptions
 * @property {boolean} typeCheck
 */

/**
 * @param {akConfig} config  config file info
 * @return {WebpackOptions} webpack config
 * @description generate webpack config
 */
const generateConfig = config => {
    const {
        analyze,
        sentry = false,
        html: configHtml = {},
        miniMomentLocales = false,
        miniMomentTimezone = false,
        typeCheck = true,
        entry,
        workDir,
        output,
        babelInclude,
        svgSprite,
        loaders: configLoaders,
        resolve: configResolve,
        resolveLoader: configResolveLoader,
        externals: configExternals,
        externalsType: configExternalsType,
        appName,
        definitions,
        staticSourcePath = './static',
        toCopyPath = './static',
        pkg,
        plugins: configPlugins,
        splitChunksVendor,
        splitChunksCacheGroups,
        terserPluginOptions,
        CssMinimizerPluginOptions,
        loaderQueries,
        devtool = 'eval-cheap-module-source-map',
        presets,
        target,
        reactRefreshPluginOptions,
    } = config;

    const { version: pkgVersion, name: pkgName } = pkg;
    const { externalScripts, externalStylesheets, ...htmlWebpackOptions } = configHtml;

    // 配置文件为true，并且为浏览器环境+不是本地开启sentry
    const useSentry = sentry && target === browserTarget && !presets.isLocal;
    // 设置externalLib
    const externalLibConfigs = parseExternalConfig({
        externalScripts,
        externalStylesheets,
        presets,
    });

    const webpackConfig = new WebpackConfig(workDir);

    // compose entry
    webpackConfig.entry = composeEntry(workDir, entry);

    // compose output
    webpackConfig.output = composeOutput(output, target, presets, workDir);

    // set mode
    webpackConfig.mode = presets.mode;

    // compose performance
    webpackConfig.performance = composePerformance(presets);

    // compose loaders
    const loaders = babelLoader(
        {
            babelInclude,
            workDir,
        },
        presets,
    )
        .concat(defaultLoaders(svgSprite))
        .concat(styleLoaders(presets));

    webpackConfig.module = composeLoaders(webpackConfig.module, loaders);
    if (configLoaders) {
        webpackConfig.module = composeLoaders(webpackConfig.module, configLoaders);
    }

    // compose resolves
    webpackConfig.resolve = composeResolve(workDir, configResolve);

    // compose resolveLoader
    webpackConfig.resolveLoader = composeResolveLoader(workDir, configResolveLoader);

    // use config's externals
    if (configExternals) {
        webpackConfig.externals = configExternals;
    }
    if (configExternalsType) {
        webpackConfig.externalsType = configExternalsType;
    }

    // default plugins
    webpackConfig.plugins = composePlugins(
        webpackConfig.plugins,
        defaultPlugins({
            version: pkgVersion,
            appName,
            pkgName,
            definitions,
            htmlWebpackOptions,
            staticSourcePath,
            toCopyPath,
            miniMomentLocales,
            miniMomentTimezone,
            workDir,
            target,
            presets,
            externalLibConfigs,
            analyze,
            reactRefreshPluginOptions,
            typeCheck,
        }),
    );
    if (configPlugins) {
        webpackConfig.plugins = composePlugins(webpackConfig.plugins, configPlugins);
    }
    // compose optimization
    webpackConfig.optimization = composeOptimization(
        target,
        splitChunksVendor,
        splitChunksCacheGroups,
        terserPluginOptions,
        CssMinimizerPluginOptions,
    );
    if (loaderQueries) {
        Object.keys(loaderQueries).forEach(name => {
            const options = loaderQueries[name];
            const loaderSuffix = /-loader$/;

            const loaderName = loaderSuffix.test(name) ? name : `${name}-loader`;

            if (webpackConfig.module && Array.isArray(webpackConfig.module.rules)) {
                webpackConfig.module.rules = composeRulesOptions(
                    webpackConfig.module.rules,
                    loaderName,
                    options,
                );
            }
        });
    }
    if (presets.mode === 'production') {
        webpackConfig.devtool = useSentry ? 'hidden-source-map' : false;
    } else {
        webpackConfig.devtool = devtool;
    }
    if (analyze) {
        const smp = new SpeedMeasurePlugin();

        if (presets.extractCSS) {
            const webpackConfigSMPWithOutMCE = smp.wrap(webpackConfig);

            webpackConfigSMPWithOutMCE.plugins.push(
                new MintCssExtractWebpackPlugin({
                    filename: 'css/build.[contenthash:10].css',
                    ignoreOrder: true,
                }),
            );

            return webpackConfigSMPWithOutMCE;
        }

        return smp.wrap(webpackConfig);
    }

    return webpackConfig;
};

module.exports = generateConfig;
