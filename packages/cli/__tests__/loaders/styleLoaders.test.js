const styleLoaders = require('../../ak-webpack-config/lib/loaders/styleLoaders');

describe('styleLoaders快照', () => {
    it('extractCSS为false', () => {
        // @ts-ignore 仅使用到extractCss
        const loaders = styleLoaders({ extractCSS: false });

        expect(loaders).toMatchSnapshot();
    });

    it('extractCSS为true', () => {
        // @ts-ignore 仅使用到extractCss
        const loaders = styleLoaders({ extractCSS: true });

        expect(loaders).toMatchSnapshot();
    });
});
