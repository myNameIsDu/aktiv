// const defaultPlugins = require('../../ak-webpack-config/lib/plugins/defaultPlugins');
// const getPresets = require('../../ak-webpack-config/presets/index');
// const { localBuildEnv, devBuildEnv, proBuildEnv } = require('../../config/index');

// const fixture = ({
//     appName,
//     definitions,
//     htmlWebpackOptions,
//     miniMomentLocales = false,
//     miniMomentTimezone = false,
//     staticSourcePath = './static',
//     toCopyPath = './static',
//     target,
//     presets,
//     liveReload,
//     externalLibConfigs,
//     analyze,
// }) => {
//     return defaultPlugins({
//         version: 'xxx',
//         appName,
//         pkgName: 'xxx',
//         definitions,
//         htmlWebpackOptions,
//         miniMomentLocales,
//         miniMomentTimezone,
//         staticSourcePath,
//         toCopyPath,
//         workDir: __dirname,
//         target,
//         presets,
//         liveReload,
//         externalLibConfigs,
//         analyze,
//     });
// };

// describe('defaultPlugins快照', () => {
//     it('传入默认值', () => {
//         // @ts-expect-error xxxx
//         const result = fixture({});

//         expect(result).toMatchSnapshot();
//     });
// });
