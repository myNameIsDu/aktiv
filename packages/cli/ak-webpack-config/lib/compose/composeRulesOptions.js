const isType = require('kind-of');
const mergeOptions = require('../../../utils/mergeOptions');

/** @typedef  {import('webpack').ModuleOptions['rules']} RuleType*/

/**
 * @param {NonNullable<RuleType>} rules rules
 * @param {string} loaderName loaderName
 * @param {any} options options
 * @returns {RuleType} return
 */
function updateLoaderOptions(rules, loaderName, options) {
    return rules.map(rule => {
        if (typeof rule === 'string') {
            if (rule === loaderName) {
                rule = {
                    loader: loaderName,
                    options,
                };
            }
        } else if (isType(rule.loader) === 'string' && rule.loader === loaderName) {
            if (typeof rule.options === 'string') {
                rule.options = options;
            } else {
                rule.options = mergeOptions(rule.options || {}, options);
            }
        } else {
            // recursive properties
            ['use', 'oneOf', 'rules'].forEach(key => {
                if (rule[key] !== undefined && rule[key].length !== 0) {
                    rule[key] = updateLoaderOptions(rule[key], loaderName, options);
                }
            });
        }

        return rule;
    });
}

/**
 * @param {RuleType} rules rules
 * @param {string} loaderName loaderName
 * @param {any} options options
 * @returns {RuleType} return
 */
function composeRulesOptions(rules, loaderName, options) {
    if (rules) {
        const newRules = [...rules];

        return updateLoaderOptions(newRules, loaderName, options);
    }
}

module.exports = composeRulesOptions;
