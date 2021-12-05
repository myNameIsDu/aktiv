#!/usr/bin/env node
/* eslint-disable no-console */
const commander = require('commander');
const path = require('path');
const chalk = require('chalk');
const akWebpackConfig = require('../ak-webpack-config/index');
const {
    defaultWorkDir,
    defaultConfigFile,
    defaultProt,
    localBuildEnv,
    browserTarget,
} = require('../config/index');
const getPreset = require('../ak-webpack-config/presets/index');
const selectPortIsOccupied = require('../utils/selectPortIsOccupied');
const checkRequiredFiles = require('../utils/checkRequiredFiles');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const prepareUrl = require('../utils/prepareUrl');
const openBrowser = require('../utils/openBrowser');

const { program } = commander;

/**
 * @param {string} str path
 * @return {string} resolve path
 */
const resolvePath = str => path.resolve(str);

program
    .usage('[options]')
    .option('-d, --dir <path>', 'set workDi', resolvePath, defaultWorkDir)
    .option('-c, --config <path>', 'set config file', resolvePath, defaultConfigFile)
    .option('-p, --port <port>', 'set dev server port', String(defaultProt))
    .option('--no-hotReplace', 'set the livereload off');
// TODO: 增加examples
// program.addHelpText('after', () => {
//     return `
//   Examples:

//   ${chalk.gray('# run ak dev server width special workDir, default is process.cwd()')}
//   $ ak dev ../

//   ${chalk.gray('# run ak dev server with special config file')}
//   $ ak dev -c ./config.js

//   ${chalk.gray('# run ak dev server width special port')}
//   $ ak dev -p 8888

//   ${chalk.gray('# run ak dev server with specified building target')}
//   $ ak dev -t node
// `;
// });
program.parse(process.argv);

const programOptions = program.opts();

/** @type {string} */
const workDir = programOptions.dir;
/** @type {string} */
const configFile = programOptions.config;
/** @type {string} */
const commandPort = programOptions.port;
/** @type {boolean} */
const commandHotReplace = programOptions.hotReplace;

const presets = getPreset(localBuildEnv, browserTarget);

/* re write process env*/
process.env.NODE_ENV = presets.env;
const configFilePath = path.resolve(workDir, configFile);
const packageFilePath = path.resolve(workDir, 'package.json');

// check package.json and configFile exist
if (!checkRequiredFiles([configFilePath, packageFilePath])) {
    process.exit(1);
}
const config = require(configFilePath);

workDir && (config.workDir = workDir);
commandHotReplace && (config.hotReplace = commandHotReplace);

config.pkg = require(packageFilePath);
config.presets = presets;
config.target = browserTarget;

/** @typedef {import('webpack-dev-server').Configuration} DevServerConfigType*/
/** @type {DevServerConfigType} */
const devServerConfig = config.server || {};
const { output: { publicPath = '/' } = {} } = config;

let { host } = devServerConfig;
const { server, https } = devServerConfig;
// check port is number
const numPort = parseInt(commandPort, 10);

if (isNaN(numPort)) {
    console.error(chalk.red(`argument 'port': ${numPort}, is invalid.`));
    console.log();
    program.help();
}
selectPortIsOccupied(numPort)
    .then(newPort => {
        const compiler = webpack(akWebpackConfig(config));
        // eslint-disable-next-line no-nested-ternary
        const protocol = server === 'https' ? 'https' : https ? 'https' : 'http';

        host = host || '0.0.0.0';

        const url = prepareUrl(protocol, host, newPort, publicPath);

        const devServer = new WebpackDevServer(
            {
                compress: true,
                historyApiFallback: true,
                hot: commandHotReplace,
                ...devServerConfig,
                host,
                port: newPort,
            },
            compiler,
        );

        devServer.startCallback(() => {
            openBrowser(url);
        });
        ['SIGINT', 'SIGTERM'].forEach(sig => {
            process.on(sig, () => {
                devServer.stop();
                process.exit();
            });
        });
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });
