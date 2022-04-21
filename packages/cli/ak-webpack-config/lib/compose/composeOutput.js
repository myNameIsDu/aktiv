const path = require('path');
const isType = require('kind-of');
const { serverTarget } = require('../../../config/index');
const throwError = require('../../../utils/throwError');
const baseSchema = require('../baseSchema');

/** @typedef {import('../../../config/index').TargetListType[number]} TargetType*/
/** @typedef {import('../../presets/index').PresetItemType} PresetItemType*/
/** @typedef {import('webpack').Configuration['output']} inputOutput */

/**
 * @param {inputOutput|string} inputOutput  inputOutput
 * @param {TargetType} target target
 * @param {PresetItemType} presets presets
 * @param {string} workDir workDir
 * @return {NonNullable<inputOutput>} inputOutput
 */
function composeOutput(inputOutput, target, presets, workDir) {
    const outputSchema = baseSchema.output;

    let output = outputSchema.default(workDir);

    if (target === serverTarget) {
        output.libraryTarget = 'commonjs2';
        output.path = path.resolve(workDir, './dist_server');
    }
    if (presets.useHash) {
        const hashType = presets.useHash;

        output.filename = `js/[name].[${hashType}].js`;
        output.chunkFilename = `js/[name].[${hashType}].js`;
    }
    if (inputOutput === undefined) {
        return output;
    }
    const inputType = isType(inputOutput);

    if (!outputSchema.type.includes(inputType)) {
        throwError("option's 'output' is invalid.");
    }

    if (inputType === 'string') {
        const inputOutputStringType = /** @type {string} */ (inputOutput);

        output.path = path.resolve(workDir, inputOutputStringType);

        return output;
    }
    if (inputType === 'object') {
        const inputOutputObjType = /** @type {{}} */ (inputOutput);

        output = { ...output, ...inputOutputObjType };

        return output;
    }

    return output;
}

module.exports = composeOutput;
