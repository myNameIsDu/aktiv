const composeEntry = require('./composeEntry');
const composeLoaders = require('./composeLoaders');
const composeOptimization = require('./composeOptimization');
const composeOutput = require('./composeOutput');
const composePerformance = require('./composePerformance');
const composePlugins = require('./composePlugins');
const composeResolveFactory = require('./composeResolveFactory');
const composeRulesOptions = require('./composeRulesOptions');
const { composeResolve, composeResolveLoader } = composeResolveFactory;

module.exports = {
    composeEntry,
    composeOutput,
    composePerformance,
    composeLoaders,
    composeResolve,
    composePlugins,
    composeOptimization,
    composeRulesOptions,
    composeResolveLoader,
    composeResolveFactory,
};
