const baseSchema = require('../baseSchema');

/** @typedef {import('webpack').RuleSetRule} RuleSetRule*/
/** @typedef {import('webpack').ModuleOptions} ModuleOptions*/
/** @typedef {ModuleOptions['rules']} ModuleRule*/

/**
 * @param {RuleSetRule} receiveLoader receiveLoader
 * @param {ModuleRule} exLoaders exLoaders
 * @returns {ModuleRule} return
 */
function uniqueCompose(receiveLoader, exLoaders = []) {
    const newExLoaders = [...exLoaders];
    /** @type {number} */
    // eslint-disable-next-line init-declarations
    let index;
    const exist = newExLoaders.find((exLoader, i) => {
        let result = false;

        if (typeof exLoader !== 'string' && String(exLoader.test) === String(receiveLoader.test)) {
            index = i;
            result = true;
        }

        return result;
    });

    if (exist) {
        // @ts-ignore 当exist 为true时 index已经赋值  此外这里断言把 ... 类型干掉，因为上边已经判断不为string
        const olderRuleSet = /** @type {RuleSetRule} */ (newExLoaders[index]);

        if (Array.isArray(olderRuleSet.use)) {
            if (Array.isArray(receiveLoader.use)) {
                olderRuleSet.use = olderRuleSet.use.concat(receiveLoader.use);
            }
            if (receiveLoader.loader) {
                olderRuleSet.use = olderRuleSet.use.concat({
                    loader: receiveLoader.loader,
                    options: receiveLoader.options,
                });
            }
        } else {
            if (receiveLoader.use) {
                olderRuleSet.use = receiveLoader.use;
                delete olderRuleSet.loader;
                delete olderRuleSet.options;
            }
            if (receiveLoader.loader) {
                olderRuleSet.loader = receiveLoader.loader;
                olderRuleSet.options = receiveLoader.options;
            }
        }
    } else {
        newExLoaders.push(receiveLoader);
    }

    return newExLoaders;
}

/**
 * @param {ModuleOptions|undefined} module module
 * @param {RuleSetRule|RuleSetRule[]|undefined} receiveLoaders receiveLoaders
 * @returns {ModuleOptions} ModuleOptions
 */
function composeLoaders(module, receiveLoaders) {
    const moduleSchema = baseSchema.module;

    const newModule = module ? { ...module } : moduleSchema.default();

    if (receiveLoaders === undefined) {
        return newModule;
    }
    if (!Array.isArray(receiveLoaders)) {
        receiveLoaders = [receiveLoaders];
    }
    receiveLoaders.forEach(loader => {
        newModule.rules = uniqueCompose(loader, newModule.rules);
    });

    return newModule;
}
composeLoaders.uniqueCompose = uniqueCompose;
module.exports = composeLoaders;
