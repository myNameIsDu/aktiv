const isType = require('kind-of');
/**
 * @param {any} s any type
 * @return {boolean} isString
 */
const isString = s => {
    return isType(s) === 'string';
};

/**
 * @param {any} s any type
 * @return {boolean} isObject
 */
const isObject = s => {
    return isType(s) === 'object';
};

/**
 * @param {any} s any type
 * @return {boolean} isArray
 */
const isArray = s => {
    return isType(s) === 'array';
};

module.exports = {
    isType,
    isString,
    isObject,
    isArray,
};
