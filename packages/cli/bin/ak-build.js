#! /usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const webpack = require('webpack');
const akWebpackConfig = require('../ak-webpack-config/index');
const getPreset = require('../ak-webpack-config/presets/index');
const {
    defaultWorkDir,
    defaultConfigFile,
    proBuildEnv,
    defaultTarget,
    supperTargetList,
    supperEnvList,
} = require('../config/index');
const checkRequiredFiles = require('../utils/checkRequiredFiles');

const { program } = commander;

/**
 * @param {string} str path
 * @return {string} resolve path
 */
const resolvePath = str => path.resolve(str);

program
    .usage('[options]')
    .option('-d, --dir <dir>', 'set workDi', resolvePath, defaultWorkDir)
    .option('-c, --config <config>', 'set config file', resolvePath, defaultConfigFile)
    .option('-a, --analyze', `enable bundle analyze mode on`, false)
    .addOption(
        new commander.Option('-m --mode <mode>', 'set build mode')
            .choices(supperEnvList)
            .default(proBuildEnv),
    )
    .addOption(
        new commander.Option('-t --target <type>', 'set building target')
            .choices(supperTargetList)
            .default(defaultTarget),
    )
    .parse(process.argv);

const programOptions = program.opts();

/** @typedef {import('../config/index').EnvListType[number]} EnvType  */

/** @type {string} */
const workDir = programOptions.dir;
/** @type {string} */
const configFile = programOptions.config;
/** @type {(typeof supperTargetList)[number]} */
const commandTarget = programOptions.target;
/** @type {EnvType} */
const commandMode = programOptions.mode;
/** @type {boolean} */
const commandAnalyze = programOptions.analyze;

/* re write process env*/
process.env.NODE_ENV = commandMode;

const configFilePath = path.resolve(workDir, configFile);
const packageFilePath = path.resolve(workDir, 'package.json');

// check package.json and configFile exist
if (!checkRequiredFiles([configFilePath, packageFilePath])) {
    program.help();
}

const config = require(configFilePath);

workDir && (config.workDir = workDir);
commandAnalyze && (config.analyze = commandAnalyze);
commandTarget && (config.target = commandTarget);
config.pkg = require(packageFilePath);
config.presets = config.presets || getPreset(commandMode, commandTarget);

const webpackConfig = akWebpackConfig(config);

webpack(webpackConfig, (error, stats) => {
    if (error) {
        console.error(chalk.red(error.message));
        process.exit(1);
    }
    if (stats) {
        console.log(
            stats.toString({
                preset: 'normal',
                colors: true,
            }),
        );
    }
});
