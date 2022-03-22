const path = require('path');
const isType = require('kind-of');
const throwError = require('../../../utils/throwError');
const validateObjectOrArrayValue = require('../../../utils/validateObjectOrArrayValue');
const baseSchema = require('../baseSchema');

/** @typedef {import('webpack').Configuration['entry']} EnTryType*/

/**
 * @param {string} workDir workDir
 * @param {string|string[]|Record<string,string>|undefined} inputEntry inputEntry
 * @returns {EnTryType}
 */

function composeEntry(workDir, inputEntry) {
    const entrySchema = baseSchema.entry;

    if (inputEntry === undefined) {
        return entrySchema.default(workDir);
    }

    const iptType = isType(inputEntry);

    if (!entrySchema.type.includes(iptType)) {
        throwError("input's entry is invalid.");
    }
    /*
        这里没有使用 iptType 是因为 ts 并不能正确推断出类型，我也没有找到好的断言写法

        目前只了解到这一种断言写法:
        let strInputEntry = @type {string} inputEntry
        但是还需要再声明一个变量，感觉不是最好
    */
    if (typeof inputEntry === 'string') {
        return path.resolve(workDir, inputEntry);
    }
    if (Array.isArray(inputEntry)) {
        if (!validateObjectOrArrayValue(inputEntry, 'string')) {
            throwError('an entry must be a string[] type. ');
        }

        return inputEntry.map(v => path.resolve(workDir, v));
    }
    if (typeof inputEntry === 'object') {
        if (!validateObjectOrArrayValue(inputEntry, 'string')) {
            throwError('an entry must be a {[x]:string}. ');
        }

        return Object.keys(inputEntry).reduce(
            (a, b) => ({
                ...a,
                [b]: path.resolve(workDir, inputEntry[b]),
            }),
            {},
        );
    }
}

module.exports = composeEntry;
