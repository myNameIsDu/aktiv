const { composeOutput } = require('../../ak-webpack-config/lib/compose/index');
const {
    proBuildEnv,
    devBuildEnv,
    localBuildEnv,
    browserTarget,
    serverTarget,
} = require('../../config/index');
const getPresets = require('../../ak-webpack-config/presets/index');
const schema = require('../../ak-webpack-config/lib/baseSchema');
const path = require('path');

describe('composeOutput', () => {
    const localPreset = getPresets(localBuildEnv, browserTarget);
    const devPreset = getPresets(devBuildEnv, browserTarget);
    const proPreset = getPresets(proBuildEnv, browserTarget);
    // const servePreset = getPresets(devBuildEnv, serverTarget);
    const workDir = './';

    describe('inputOutput为空', () => {
        it('localPreset, browserTarget 应该返回默认值', () => {
            const output = composeOutput(undefined, browserTarget, localPreset, workDir);

            expect(output).toEqual(schema.output.default(workDir));
        });
        it('devPreset, browserTarget 应该修改hash值返回', () => {
            const output = composeOutput(undefined, browserTarget, devPreset, workDir);

            expect(output).toMatchObject({
                filename: `js/[name].[${proPreset.useHash}].js`,
                chunkFilename: `js/[name].[${proPreset.useHash}].js`,
            });
        });
        it('proPreset, browserTarget 应该修改hash值返回', () => {
            const output = composeOutput(undefined, browserTarget, proPreset, workDir);

            expect(output).toMatchObject({
                filename: `js/[name].[${proPreset.useHash}].js`,
                chunkFilename: `js/[name].[${proPreset.useHash}].js`,
            });
        });
        it('devPreset, serverTarget 应该修改path、libraryTarget返回', () => {
            const output = composeOutput(undefined, serverTarget, devPreset, workDir);

            expect(output).toMatchObject({
                libraryTarget: 'commonjs2',
                path: path.resolve(workDir, './dist_server'),
            });
        });
    });

    describe('inputOutput不为空', () => {
        const wrapperComposeOutput = iptOutput =>
            composeOutput(iptOutput, browserTarget, devPreset, workDir);

        describe('inputOutput类型校验', () => {
            it.each([
                ['object', {}],
                ['string', './xxx'],
            ])('输入 %s 应该正常返回', (type, iptOutput) => {
                expect(() => {
                    wrapperComposeOutput(iptOutput);
                }).not.toThrow();
            });
            it.each([
                ['number', 123],
                ['boolean', true],
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                ['function', () => {}],
                ['null', null],
            ])('输入 %s 应该抛出错误', (type, iptOutput) => {
                expect(() => {
                    wrapperComposeOutput(iptOutput);
                }).toThrow();
            });
        });

        it('输入字符串应该改变path返回', () => {
            const iptPath = './xxxx';

            const output = wrapperComposeOutput(iptPath);

            expect(output).toMatchObject({
                path: path.resolve(workDir, iptPath),
            });
        });

        it('输入object应该覆盖返回', () => {
            const iptOutput = {
                path: './xxxx',
                charset: false,
            };

            const output = wrapperComposeOutput(iptOutput);

            expect(output).toMatchObject(iptOutput);
        });
    });
});
