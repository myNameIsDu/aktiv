/** @typedef { import('../../presets/index').PresetItemType } PresetItemType */
/** @typedef {import('webpack').Configuration['performance']} PerType*/

/**
 * @param {PresetItemType} presets presets
 * @return {PerType} PerType
 */
function composePerformance(presets) {
    const { mode } = presets;

    if (mode === 'production') {
        return { hints: false };
    } else if (mode === 'development') {
        return { hints: 'warning' };
    }

    return { hints: 'warning' };
}

module.exports = composePerformance;
