const schema = require('../../ak-webpack-config/lib/baseSchema');
const composeLoaders = require('../../ak-webpack-config/lib/compose/composeLoaders');

describe('composeLoaders', () => {
    it('module为undefined，receiveLoaders为undefined应该返回defaultModule', () => {
        const result = composeLoaders(undefined, undefined);
        const moduleSchema = schema.module;
        const defaultModule = moduleSchema.default();

        expect(result).toEqual(defaultModule);
    });

    it('receiveLoaders为undefined返回module', () => {
        const module = {
            rules: [
                {
                    test: /\.css/,
                    loader: 'css-loader',
                },
            ],
        };

        const result = composeLoaders(module, undefined);

        expect(result).toEqual(module);
    });

    it('传入receiveLoaders为数组应该push到rules', () => {
        const module = {
            rules: [
                {
                    test: /\.css/,
                    loader: 'css-loader',
                },
            ],
        };
        const receiveLoaders = [
            {
                test: /\.less/,
                loader: 'less-loader',
            },
            {
                test: /\.ts/,
                loader: 'ts-loader',
            },
        ];
        const result = composeLoaders(module, receiveLoaders);

        expect(result).toEqual({
            rules: [...module.rules, ...receiveLoaders],
        });
    });

    it('receiveLoaders为单个ruleSet时应该push到rules', () => {
        const module = {
            rules: [
                {
                    test: /\.css/,
                    loader: 'css-loader',
                },
            ],
        };
        const receiveLoader = {
            test: /\.less/,
            loader: 'less-loader',
        };
        const result = composeLoaders(module, receiveLoader);

        expect(result).toEqual({
            rules: [...module.rules, receiveLoader],
        });
    });

    describe('receiveLoaders和rules存在重复', () => {
        it('rule存在use,receiveLoader存在use,rule.use应当push receiveLoader.use', () => {
            const module = {
                rules: [
                    {
                        test: /\.css/,
                        use: ['style-loader'],
                    },
                ],
            };
            const receiveLoader = {
                test: /\.css/,
                use: ['css-loader'],
            };
            const result = composeLoaders(module, receiveLoader);

            expect(result).toEqual({
                rules: [
                    {
                        test: /\.css/,
                        use: ['style-loader', 'css-loader'],
                    },
                ],
            });
        });

        it('rule存在use,receiveLoader存在loader,rule.use应当push {loader: receiveLoader.loader,options:receiveLoader.options}', () => {
            const module = {
                rules: [
                    {
                        test: /\.css/,
                        use: ['style-loader'],
                    },
                ],
            };
            const receiveLoader = {
                test: /\.css/,
                loader: 'css-loader',
                options: {
                    hello: 123,
                },
            };
            const result = composeLoaders(module, receiveLoader);

            expect(result).toEqual({
                rules: [
                    {
                        test: /\.css/,
                        use: [
                            'style-loader',
                            { loader: receiveLoader.loader, options: receiveLoader.options },
                        ],
                    },
                ],
            });
        });

        it('rule不存在use,receiveLoader存在use,rule应当赋值receiveLoaders.use', () => {
            const module = {
                rules: [
                    {
                        test: /\.css/,
                    },
                ],
            };
            const receiveLoader = {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
            };

            const result = composeLoaders(module, receiveLoader);

            expect(result).toEqual({ rules: [receiveLoader] });
        });

        it('rule不存在use,但是存在loader options,receiveLoader存在use,rule应该删除loader options', () => {
            const module = {
                rules: [
                    {
                        test: /\.css/,
                        loader: 'css-loader',
                        options: {
                            hello: 123,
                        },
                    },
                ],
            };
            const receiveLoader = {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
            };

            const result = composeLoaders(module, receiveLoader);

            expect(result).toEqual({ rules: [receiveLoader] });
        });

        it('receiveLoader存在loader,rule不存在use,rule应该赋值loader options', () => {
            const module = {
                rules: [
                    {
                        test: /\.css/,
                    },
                ],
            };
            const receiveLoader = {
                test: /\.css/,
                loader: 'style-loader',
                options: {
                    hello: 123,
                },
            };
            const result = composeLoaders(module, receiveLoader);

            expect(result).toEqual({
                rules: [
                    {
                        test: /\.css/,
                        loader: 'style-loader',
                        options: {
                            hello: 123,
                        },
                    },
                ],
            });
        });
    });
});
