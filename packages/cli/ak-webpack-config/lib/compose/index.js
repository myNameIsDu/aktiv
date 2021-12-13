const composeEntry = require('./composeEntry');
const composeOutput = require('./composeOutput');
const composePerformance = require('./composePerformance');
const composeLoaders = require('./composeLoaders');
const composeResolveFactory = require('./composeResolveFactory');
const { composeResolve, composeResolveLoader } = composeResolveFactory;
const composePlugins = require('./composePlugins');
const composeOptimization = require('./composeOptimization');
const composeRulesOptions = require('./composeRulesOptions');

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
