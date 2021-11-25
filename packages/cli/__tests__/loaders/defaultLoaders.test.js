const defaultLoaders = require('../../ak-webpack-config/lib/loaders/defaultLoaders');
const { imgWithOutSvg, imgWithSvg, fontsStatic, generateSvgSprite } = defaultLoaders;

describe('defaultLoaders', () => {
    it('svgSprite为false应该返回imageWithSvg', () => {
        const loaders = defaultLoaders(false);

        expect(loaders).toEqual([imgWithSvg, fontsStatic]);
    });

    it('svgSprite为true应该返回imageWithOutSve和options为{}的svg-sprite-loader', () => {
        const loaders = defaultLoaders(true);

        expect(loaders).toEqual([imgWithOutSvg, fontsStatic, generateSvgSprite({})]);
    });
    it('传入svgSprite参数应该返回带参数的svg-sprite-loader', () => {
        const svgSprite = { hello: '123' };
        const loaders = defaultLoaders(svgSprite);

        expect(loaders).toEqual([imgWithOutSvg, fontsStatic, generateSvgSprite(svgSprite)]);
    });
});
