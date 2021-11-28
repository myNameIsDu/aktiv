const { composePerformance } = require('../../ak-webpack-config/lib/compose/index');
const getPreset = require('../../ak-webpack-config/presets/index');

describe('composePerformance', () => {
    const localPreset = getPreset('local', 'browser');
    const devPreset = getPreset('development', 'browser');
    const proPreset = getPreset('production', 'browser');

    it('pro环境应该返回false', () => {
        const performance = composePerformance(proPreset);

        expect(performance).toMatchObject({
            hints: false,
        });
    });

    it('dev环境应该返回warning', () => {
        const performance = composePerformance(devPreset);

        expect(performance).toMatchObject({
            hints: 'warning',
        });
    });

    it('local环境应该返回warning', () => {
        const performance = composePerformance(localPreset);

        expect(performance).toMatchObject({
            hints: 'warning',
        });
    });

    it('默认应该返回warning', () => {
        // @ts-expect-error 测试默认值
        const performance = composePerformance({});

        expect(performance).toMatchObject({
            hints: 'warning',
        });
    });
});
