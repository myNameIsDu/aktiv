const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const genAppName = require('../../../utils/genAppName');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { browserTarget } = require('../../../config/index');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Webpack = require('webpackbar');
const ExternalScriptsPlugin = require('./ExternalScriptsPlugin');
const MintCssExtractWebpackPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('./WatchMissingNodeModulesPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function composeHtmlWebpackPlugin(htmlOptions, plugins, mode) {
    const isDevMode = mode === 'development';
    const { template, ...resetOptions } = htmlOptions;
    const htmlTemplate = template
        ? path.resolve(process.cwd(), template)
        : path.resolve(__dirname, '../../template.ejs');
    const htmlConfig = {
        template: htmlTemplate,
        minify: isDevMode
            ? undefined
            : {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
              },
        ...resetOptions,
    };

    plugins.push(new HtmlWebpackPlugin(htmlConfig));
}
/** @typedef {import('../../../config/index').TargetListType[number]} TargetType*/
/** @typedef {import('../../../ak-webpack-config/presets/index').PresetItemType} PresetItemType*/
/** @typedef {import('../../../ak-webpack-config/lib/parseExternalConfig').ParseResult } ParseResult*/
/** @typedef {import('webpack').Configuration['plugins']} PluginsType*/
/** @typedef {import('html-webpack-plugin').Options} HtmlWebpackPluginOptions */
/** @typedef {import('moment-timezone-data-webpack-plugin').Options} MiniMomentTimezoneOptions */
/** @typedef {{ externalScripts:ParseResult[], externalStylesheets: ParseResult[] }}  ExternalLibConfigs*/

/**
 * @param {Object} options options
 * @param {string} options.version version
 * @param {string} options.appName appName
 * @param {string} options.pkgName pkgName
 * @param {Record<string, unknown>} options.definitions definitions
 * @param {HtmlWebpackPluginOptions} options.htmlWebpackOptions htmlWebpackOptions
 * @param {{localesToKeep:string[], ignoreInvalidLocales:boolean}|boolean} options.miniMomentLocales miniMomentLocales
 * @param {MiniMomentTimezoneOptions|boolean} options.miniMomentTimezone miniMomentTimezone
 * @param {string} options.staticSourcePath staticSourcePath
 * @param {string} options.toCopyPath toCopyPath
 * @param {string} options.workDir workDir
 * @param {TargetType} options.target target
 * @param {PresetItemType} options.presets PresetItemType
 * @param {boolean} options.liveReload liveReload
 * @param {ExternalLibConfigs} options.externalLibConfigs externalLibConfigs
 * @param {boolean} options.analyze analyze
 * @return {PluginsType} return
 */
function defaultPlugins(options) {
    const {
        version,
        pkgName,
        definitions,
        htmlWebpackOptions,
        miniMomentLocales,
        miniMomentTimezone,
        staticSourcePath,
        toCopyPath,
        workDir,
        target,
        presets,
        liveReload,
        externalLibConfigs,
        analyze,
    } = options;
    let { appName } = options;
    const { isLocal, outputHTML, mode, extractCSS } = presets;

    appName = appName || genAppName(pkgName);

    const plugins = [
        // @ts-ignore not need options
        new Webpack(),
        new ExternalScriptsPlugin(externalLibConfigs),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve(workDir, './tsconfig.json'),
                mode: 'write-references',
            },
        }),
    ];
    const builtInDefinitions = {
        'process.env.IS_LOCAL': JSON.stringify(isLocal),
        'process.env.BROWSER': JSON.stringify(target === browserTarget),
        'process.env.APP_NAME': JSON.stringify(appName),
        'process.env.APP_VERSION': JSON.stringify(version),
    };

    if (definitions) {
        Object.keys(definitions).forEach(name => {
            const prop = definitions[name];

            builtInDefinitions[name] = JSON.stringify(prop);
        });
    }
    plugins.push(new webpack.DefinePlugin(builtInDefinitions));

    if (outputHTML && target === browserTarget) {
        composeHtmlWebpackPlugin(htmlWebpackOptions, plugins, mode);
    }

    const fromPath = path.resolve(workDir, staticSourcePath);

    if (fs.existsSync(fromPath)) {
        plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: fromPath,
                        to: toCopyPath,
                    },
                ],
            }),
        );
    }

    if (extractCSS) {
        plugins.push(
            new MintCssExtractWebpackPlugin({
                filename: 'css/build.[contenthash:10].css',
                ignoreOrder: true,
            }),
        );
    }

    if (miniMomentLocales) {
        const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

        plugins.push(
            // 移除moment 本地化
            new MomentLocalesPlugin(
                typeof miniMomentLocales === 'object' ? miniMomentLocales : undefined,
            ),
        );
    }
    if (miniMomentTimezone) {
        const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
        const MomentTimezoneDataPluginOptions =
            typeof miniMomentTimezone === 'object'
                ? miniMomentTimezone
                : {
                      startYear: 2000,
                      endYear: 2050,
                  };

        plugins.push(
            // 移除moment 时区相关
            new MomentTimezoneDataPlugin(MomentTimezoneDataPluginOptions),
        );
    }

    if (isLocal) {
        // 在安装包后不需要重新构建
        plugins.push(new WatchMissingNodeModulesPlugin(path.resolve(workDir, 'node_modules')));
        // 强制区分大小写
        plugins.push(new CaseSensitivePathsPlugin());
    }
    if (isLocal && liveReload) {
        plugins.push(new ReactRefreshWebpackPlugin());
    }
    if (analyze) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
}

module.exports = defaultPlugins;
