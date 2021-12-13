const styleLoaders = require('../../ak-webpack-config/lib/loaders/styleLoaders');

describe('styleLoaders快照', () => {
    const testResult = extractCSS => [
        {
            test: /\.css$/,
            use: [
                extractCSS
                    ? {
                          loader: expect.stringMatching(
                              'node_modules/mini-css-extract-plugin/dist/loader.js',
                          ),
                      }
                    : expect.stringMatching('node_modules/style-loader/dist/cjs.js'),
                expect.stringMatching('node_modules/css-loader/dist/cjs.js'),
                {
                    loader: expect.stringMatching('node_modules/postcss-loader/dist/cjs.js'),
                    options: {
                        postcssOptions: {
                            plugins: [expect.any(Function)],
                        },
                    },
                },
            ],
        },
        {
            test: /\.less$/,
            use: [
                extractCSS
                    ? {
                          loader: expect.stringMatching(
                              'node_modules/mini-css-extract-plugin/dist/loader.js',
                          ),
                      }
                    : expect.stringMatching('node_modules/style-loader/dist/cjs.js'),
                expect.stringMatching('node_modules/css-loader/dist/cjs.js'),
                {
                    loader: expect.stringMatching('node_modules/postcss-loader/dist/cjs.js'),
                    options: {
                        postcssOptions: {
                            plugins: [expect.any(Function)],
                        },
                    },
                },
                {
                    loader: expect.stringMatching('node_modules/less-loader/dist/cjs.js'),
                    options: {
                        lessOptions: {
                            javascriptEnabled: true,
                        },
                    },
                },
            ],
        },
    ];

    it('extractCSS为false', () => {
        // @ts-ignore 仅使用到extractCss
        const loaders = styleLoaders({ extractCSS: false });

        expect(loaders).toMatchObject(testResult(false));
    });

    it('extractCSS为true', () => {
        // @ts-ignore 仅使用到extractCss
        const loaders = styleLoaders({ extractCSS: true });

        expect(loaders).toMatchObject(testResult(true));
    });
});
