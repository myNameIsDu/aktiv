const { serverTarget } = require('../../config/index');

/** @typedef  {import('../../config/index').TargetListType[number]} TargetType*/
/** @typedef  {import('../../config/index').EnvListType[number]} EnvType*/
/** @typedef  {import('webpack').Configuration['mode']} modeType*/

/**
 * @typedef {Object} PresetItemType
 * @property {string | false} [useHash]
 * @property {string} env
 * @property {modeType} mode
 * @prop {boolean} isLocal
 * @prop {boolean} useSentry
 * @prop {boolean} outputHTML
 * @prop {boolean} extractCSS
 */
/** @type {Record<EnvType, PresetItemType>} */
const presets = {
    local: {
        useHash: false,
        env: 'development',
        mode: 'development',
        outputHTML: true,
        isLocal: true,
        extractCSS: false,
        useSentry: false,
    },
    development: {
        useHash: 'contenthash',
        env: 'development',
        mode: 'development',
        outputHTML: true,
        isLocal: false,
        extractCSS: true,
        useSentry: false,
    },
    production: {
        useHash: 'contenthash',
        env: 'production',
        mode: 'production',
        outputHTML: true,
        isLocal: false,
        useSentry: true,
        extractCSS: true,
    },
};

/**
 * @param {EnvType} env env
 * @param {TargetType} target target
 * @return {PresetItemType} preset
 */
const presetFunc = (env, target) => {
    const preset = presets[env];

    if (target === serverTarget) {
        delete preset.useHash;
    }

    return preset;
};

module.exports = presetFunc;
