const isType = require('kind-of');

/**
 * @param {Record<string, any>} toOps toOps
 * @param {Record<string, any>} fromOps fromOps
 * @return {Record<string, any>} return
 */
function mergeOptions(toOps, fromOps) {
    const result = { ...toOps };

    Object.keys(fromOps).forEach(key => {
        if (result[key] === undefined) {
            result[key] = fromOps[key];
        } else if (isType(result[key]) === 'array') {
            result[key] = result[key].concat(fromOps[key]);
        } else if (isType(result[key]) === 'object' && isType(fromOps[key]) === 'object') {
            result[key] = { ...result[key], ...fromOps[key] };
        } else {
            result[key] = fromOps[key];
        }
    });

    return result;
}

module.exports = mergeOptions;
