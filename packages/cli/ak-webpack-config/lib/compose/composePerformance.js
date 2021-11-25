const { proBuildEnv, devBuildEnv, localBuildEnv } = require('../../../config/index');

/** @typedef { import('../../../config/index').EnvListType[number] } EnvType */
/** @typedef {import('webpack').Configuration['performance']} PerType*/

/**
 * @param {EnvType} buildEnv buildEnv
 * @return {PerType} PerType
 */
function composePerformance(buildEnv) {
    if (buildEnv === proBuildEnv) {
        return { hints: false };
    } else if (buildEnv === devBuildEnv) {
        return { hints: 'warning' };
    } else if (buildEnv === localBuildEnv) {
        return { hints: 'warning' };
    }

    return { hints: 'warning' };
}

module.exports = composePerformance;
