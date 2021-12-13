const { composeResolveFactory } = require('../../ak-webpack-config/lib/compose');
const { composeResolve, composeResolveLoader } = composeResolveFactory;
const baseSchema = require('../../ak-webpack-config/lib/baseSchema');

const workDir = './';

describe('composeResolveFactory', () => {
    it('传入target不为resolve或者resolveLoader应该返回undefined', () => {
        // @ts-expect-error 测试传入错误target
        const result = composeResolveFactory('asd', workDir, {});

        expect(result).toBe(undefined);
    });
});

describe.each([
    ['composeResolve', 'resolve', composeResolve],
    ['composeResolveLoader', 'resolveLoader', composeResolveLoader],
])('%s', (_funcName, target, func) => {
    const schema = baseSchema[target];
    const defaultConfig = schema.default(workDir);

    describe('不传入receiveConfig', () => {
        it('不传入receiveConfig应该返回默认值', () => {
            const result = func(workDir);

            expect(result).toEqual(defaultConfig);
        });
    });

    describe('传入receiveConfig', () => {
        const ruleTable = [
            [{ other: undefined }, defaultConfig],
            [{ other: 456 }, { ...defaultConfig, other: 456 }],
        ];

        if (target === 'resolve') {
            ruleTable.push([
                { extensions: '.yml' },
                { ...defaultConfig, extensions: [...defaultConfig.extensions, '.yml'] },
            ]);
        }
        it.each(ruleTable)('传入receiveConfig为%o,应该返回 %o', (receiveOps, expectedOps) => {
            const result = func(workDir, receiveOps);

            expect(result).toEqual(expectedOps);
        });
        it('传入receiveConfig不为object应该抛出错误', () => {
            expect(() => {
                // @ts-expect-error 忽略类型错误，只检查逻辑
                func(workDir, 123);
            }).toThrowError(`${target} config must be object`);
        });
    });
});
