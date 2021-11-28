const baseSchema = require('../baseSchema.js');
const isType = require('kind-of');
const mergeOptions = require('../../../utils/mergeOptions');
const throwError = require('../../../utils/throwError');

/** @typedef {import('../../../config/index').TargetListType[number]} TargetType */
/** @typedef {import('webpack').ResolveOptions} ResolveType*/

/**
 * @param {'resolve'|'resolveLoader'} target target
 * @param {string} workDir workDir
 * @param {ResolveType} [receiveConfig] config
 * @return {ResolveType|undefined} return
 */
function composeResolveFactory(target, workDir, receiveConfig) {
    const schema = baseSchema[target];

    if (schema === undefined) {
        return;
    }
    let resultConfig = schema.default(workDir);

    if (receiveConfig === undefined) {
        return resultConfig;
    }

    if (isType(receiveConfig) !== 'object') {
        throwError(`akConfig error:  ${target} config must be object`);
    }

    Object.keys(receiveConfig).forEach(key => {
        const value = receiveConfig[key];

        if (value === undefined) {
            return;
        }
        if (resultConfig[key] === undefined) {
            resultConfig[key] = value;
        } else {
            const options = {};

            options[key] = value;
            resultConfig = mergeOptions(resultConfig, options);
        }
    });

    return resultConfig;
}

/**
 * @param {string} workDir workDir
 * @param {ResolveType|undefined} [receiveConfig] config
 * @return {ResolveType|undefined} return
 */
const composeResolve = (workDir, receiveConfig) =>
    composeResolveFactory('resolve', workDir, receiveConfig);

/**
 * @param {string} workDir workDir
 * @param {ResolveType} [receiveConfig] config
 * @return {ResolveType|undefined} return
 */
const composeResolveLoader = (workDir, receiveConfig) =>
    composeResolveFactory('resolveLoader', workDir, receiveConfig);

module.exports = composeResolveFactory;
module.exports.composeResolve = composeResolve;
module.exports.composeResolveLoader = composeResolveLoader;
