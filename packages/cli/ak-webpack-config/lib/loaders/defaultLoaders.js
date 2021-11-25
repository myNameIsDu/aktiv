const imgWithOutSvg = {
    test: /\.(png|jpe?g|gif|webp)$/,
    type: 'asset',
    generator: {
        filename: 'static/images/[name].[contenthash][ext]',
    },
};
const imgWithSvg = {
    test: /\.(png|jpe?g|gif|webp|svg)$/,
    type: 'asset',
    generator: {
        filename: 'static/images/[name].[contenthash][ext]',
    },
};
const fontsStatic = {
    test: /\.(woff2?|eot|ttf|otf)$/,
    type: 'asset/resource',
    generator: {
        filename: 'static/fonts/[name].[contenthash][ext]',
    },
};
const generateSvgSprite = options => ({
    test: /\.svg$/,
    use: [
        {
            loader: 'svg-sprite-loader',
            options,
        },
        'svgo-loader',
    ],
});

/** @typedef {import('webpack').RuleSetRule} RuleSetRule*/

/**
 * @param {boolean | Record<string, any>} svgSprite svgSprite
 * @return {RuleSetRule[]} loaders
 */
function defaultLoaders(svgSprite) {
    let loaders = [];

    if (svgSprite) {
        loaders = loaders.concat(imgWithOutSvg, fontsStatic);
        if (typeof svgSprite === 'boolean') {
            const svgSpriteLoader = generateSvgSprite({});

            loaders = loaders.concat(svgSpriteLoader);

            return loaders;
        }
        const svgSpriteLoader = generateSvgSprite(svgSprite);

        loaders = loaders.concat(svgSpriteLoader);

        return loaders;
    }

    return loaders.concat(imgWithSvg, fontsStatic);
}

module.exports = defaultLoaders;
module.exports.imgWithOutSvg = imgWithOutSvg;
module.exports.imgWithSvg = imgWithSvg;
module.exports.fontsStatic = fontsStatic;
module.exports.generateSvgSprite = generateSvgSprite;
