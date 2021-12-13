const baseSchema = require('../baseSchema');

/** @typedef {import('webpack').Configuration['plugins']} PluginsType*/

/**
 * @param {PluginsType} oldPlugins oldPlugins
 * @param {PluginsType} receivePlugins receivePlugins
 * @return {PluginsType} return
 */
function composePlugins(oldPlugins, receivePlugins) {
    const pluginSchema = baseSchema.plugins;
    const resultPlugins = oldPlugins ? [...oldPlugins] : pluginSchema.default();

    if (receivePlugins === undefined) {
        return resultPlugins;
    }

    if (!Array.isArray(receivePlugins)) {
        receivePlugins = [receivePlugins];
    }

    return resultPlugins.concat(receivePlugins);
}

module.exports = composePlugins;
