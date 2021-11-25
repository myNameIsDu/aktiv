const { composePerformance } = require('../../ak-webpack-config/lib/compose/index');
const { proBuildEnv, devBuildEnv, localBuildEnv } = require('../../config/index');

describe('composePerformance', () => {
    it('pro环境应该返回false', () => {
        const performance = composePerformance(proBuildEnv);

        expect(performance).toMatchObject({
            hints: false,
        });
    });

    it('dev环境应该返回warning', () => {
        const performance = composePerformance(devBuildEnv);

        expect(performance).toMatchObject({
            hints: 'warning',
        });
    });

    it('local环境应该返回warning', () => {
        const performance = composePerformance(localBuildEnv);

        expect(performance).toMatchObject({
            hints: 'warning',
        });
    });

    it('默认应该返回warning', () => {
        // @ts-expect-error 测试默认值
        const performance = composePerformance();

        expect(performance).toMatchObject({
            hints: 'warning',
        });
    });
});
