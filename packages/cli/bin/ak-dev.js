#!/usr/bin/env node
/* eslint-disable no-console */
const commander = require('commander');
const path = require('path');
const chalk = require('chalk');
// const DevServer = require('@aktiv/dev-server');
const akWebpackConfig = require('../ak-webpack-config/index');
const {
    defaultWorkDir,
    defaultConfigFile,
    defaultProt,
    localBuildEnv,
    defaultTarget,
    supperTargetList,
} = require('../config/index');
const getPreset = require('../ak-webpack-config/presets/index');

const checkRequiredFiles = require('../utils/checkRequiredFiles');

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
    .option('--no-liveReload', 'set the livereload off')
    .addOption(
        new commander.Option('-t --target <type>', 'set building target')
            .choices(supperTargetList)
            .default(defaultTarget),
    );

program.addHelpText('after', () => {
    return `
  Examples: 

  ${chalk.gray('# run ak dev server width special workDir, default is process.cwd()')}
  $ ak dev ../

  ${chalk.gray('# run ak dev server with special config file')}
  $ ak dev -c ./config.js

  ${chalk.gray('# run ak dev server width special port')}
  $ ak dev -p 8888

  ${chalk.gray('# run ak dev server with specified building target')}
  $ ak dev -t node
`;
});
program.parse(process.argv);

const programOptions = program.opts();

/** @type {string} */
const workDir = programOptions.dir;
/** @type {string} */
const configFile = programOptions.config;
/** @type {string} */
const commandPort = programOptions.port;
/** @type {(typeof supperTargetList)[number]} */
const commandTarget = programOptions.target;
/** @type {boolean} */
const commandLiveReload = programOptions.liveReload;

const preset = getPreset(localBuildEnv, commandTarget);

/* re write process env*/
process.env.NODE_ENV = preset.env;

// check port is number
const numPort = parseInt(commandPort, 10);

if (isNaN(numPort)) {
    console.error(chalk.red(`argument 'port': ${numPort}, is invalid.`));
    console.log();
    program.help();
}

const configFilePath = path.resolve(workDir, configFile);
const packageFilePath = path.resolve(workDir, 'package.json');

// check package.json and configFile exist
if (!checkRequiredFiles([configFilePath, packageFilePath])) {
    process.exit(1);
}
const config = require(configFilePath);

config.pkg = require(packageFilePath);
config.workDir = workDir;
config.liveReload = commandLiveReload;

const webpack = require('webpack');

const webpackConfig = akWebpackConfig(config, localBuildEnv, commandTarget);

// webpack(webpackConfig, (error, stats) => {
//     console.log('my callback');
//     if (error) {
//         console.error(chalk.red(error.message));
//         process.exit(1);
//     }
// if (stats) {
//     console.log(stats,'-------------stats')
//     const info = stats.toJson();

//     // console.log(info, '----');
//     if (stats.hasErrors()) {
//         console.log('error,=================');
//         console.error(info.errors);
//     }

//     if (stats.hasWarnings()) {
//         console.log('stat warn---------');
//         console.warn(info.warnings);
//     }
//     console.log(
//         stats.toString({
//             modules: false,
//             chunks: false,
//             children: false,
//             colors: true,
//         }),
//     );
// }
// });
// selectPortIsOccupied(numPort).then(newPort => {
//     config.server = { ...config.server, port: newPort };
//     const server = new DevServer(config);
// });
