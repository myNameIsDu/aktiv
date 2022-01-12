const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @typedef {import('webpack').RuleSetUseItem} RuleSetUseItem*/

/**
 * @param {boolean} extractCSS buildEnv
 * @return {RuleSetUseItem[]} loaders
 */
const normalLoaders = extractCSS => {
    return [
        extractCSS ? { loader: MiniCssExtractPlugin.loader } : require.resolve('style-loader'),
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: {
                postcssOptions: {
                    plugins: [require(require.resolve('autoprefixer'))],
                },
            },
        },
    ];
};

const LOADERS = [
    {
        pkg: 'css',
        config: extractCSS => ({ test: /\.css$/, use: normalLoaders(extractCSS) }),
    },
    {
        pkg: 'less',
        config: extractCSS => {
            const loaders = normalLoaders(extractCSS);
            const lessOptions = {
                javascriptEnabled: true,
            };

            loaders.push({ loader: require.resolve('less-loader'), options: { lessOptions } });

            return {
                test: /\.less$/,
                use: loaders,
            };
        },
    },
];
/** @typedef {import('../../presets/index').PresetItemType} PresetItemType*/
/** @typedef {import('webpack').RuleSetRule} RuleSetRule*/
/**
 * @param {PresetItemType} presets presets
 * @return {RuleSetRule[]} loaders
 */

function styleLoaders(presets) {
    const { extractCSS } = presets;

    return LOADERS.map(({ config }) => {
        return config(extractCSS);
    });
}

module.exports = styleLoaders;
