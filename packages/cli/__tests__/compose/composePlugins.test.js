const schema = require('../../ak-webpack-config/lib/baseSchema.js');
const composePlugins = require('../../ak-webpack-config/lib/compose/composePlugins');

describe('composePlugins', () => {
    const pluginSchema = schema.plugins;

    it.each([
        [undefined, undefined, pluginSchema.default()],
        [[1], undefined, [1]],
        [[1], 2, [1, 2]],
        [[1], [2], [1, 2]],
    ])(
        '输入oldPlugins %o,输入receivePlugins %o,应该返回%o',
        (oldPlugins, receivePlugins, expectedPlugins) => {
            // @ts-expect-error 只测试逻辑
            const result = composePlugins(oldPlugins, receivePlugins);

            expect(result).toEqual(expectedPlugins);
        },
    );
});
