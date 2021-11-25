const isType = require('kind-of');

/**
 * @param {{}|any[]} obj obj
 * @param {string} type type
 * @return {boolean} return isType
 */
function validateObjectOrArrayValue(obj, type) {
    if (isType(type) !== 'string') {
        throw new Error("parameter 'type' must be string");
    }

    type = type.toLowerCase();

    if (Array.isArray(obj)) {
        return obj./** @type {any[]} */ every(i => isType(i) === type);
    }

    if (typeof obj === 'object' && obj !== null) {
        if (Object.keys(obj).length === 0) {
            return false;
        }

        return Object.keys(obj).every(i => isType(obj[i]) === type);
    }

    return false;
}
module.exports = validateObjectOrArrayValue;
