#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const akWebpackConfig = require('../ak-webpack-config/index');
const getPreset = require('../ak-webpack-config/presets/index');
const {
    defaultWorkDir,
    defaultConfigFile,
    defaultPort,
    localBuildEnv,
    browserTarget,
} = require('../config/index');
const checkRequiredFiles = require('../utils/checkRequiredFiles');
const CertEngine = require('../utils/createCaCertificate');
const openBrowser = require('../utils/openBrowser');
const prepareUrl = require('../utils/prepareUrl');
const selectPortIsOccupied = require('../utils/selectPortIsOccupied');

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
    .option('-p, --port <port>', 'set dev server port', String(defaultPort));

program.addHelpText('after', () => {
    return `
  Examples:

  ${chalk.gray('# run ak dev server width special workDir, default is process.cwd()')}
  $ ak dev ../

  ${chalk.gray('# run ak dev server with special config file')}
  $ ak dev -c ./config.js

  ${chalk.gray('# run ak dev server width special port')}
  $ ak dev -p 8888

  ${chalk.gray('# run ak dev server without HMR')}
  $ ak dev --no-hot-replace
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

config.pkg = require(packageFilePath);
config.presets = presets;
config.target = browserTarget;
/** @typedef {import ('https').ServerOptions} httpsServerOptions*/
/** @typedef {import('webpack-dev-server').Configuration} DevServerConfigType*/
/** @type {DevServerConfigType} */
const devServerConfig = config.server || {};
const { output: { publicPath = '/' } = {} } = config;

const certWriteList = ['0.0.0.0', '127.0.0.1', 'localhost'];

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

        /** @type {'http:'|'https:'} */
        const fromHttpsProtocol = https ? 'https:' : 'http:';

        /** @type {{ type?: string; options?: httpsServerOptions }} */
        const serverNormal = typeof server === 'object' ? server : { type: server, options: {} };

        /** @type {string|undefined} */
        const fromServerProtocolType = serverNormal.type;

        /** @type {'http:'|'https:'} */
        const protocol = fromServerProtocolType === 'https' ? 'https:' : fromHttpsProtocol;

        host = host || '0.0.0.0';

        const url = prepareUrl(protocol, host, newPort, publicPath);

        /** @type {{server?:{ type?: string; options?: httpsServerOptions }}}*/
        let httpsCaInfo = {};

        if (protocol === 'https:') {
            httpsCaInfo = {
                server: {
                    type: 'https',
                    options: {
                        ...new CertEngine(
                            certWriteList.includes(host) ? undefined : host,
                        ).createCertificate(),
                        ...serverNormal.options,
                    },
                },
            };
        }

        const devServer = new WebpackDevServer(
            {
                compress: true,
                historyApiFallback: true,
                hot: true,
                ...devServerConfig,
                host,
                port: newPort,
                ...httpsCaInfo,
            },
            compiler,
        );

        devServer.startCallback(() => {
            openBrowser(url);
        });

        const sigs = /** @type {const} */ (['SIGINT', 'SIGTERM']);

        sigs.forEach(sig => {
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
