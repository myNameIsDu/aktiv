const chalk = require('chalk');
const detectPort = require('detect-port');
const isRoot = require('is-root');

/**
 * @param {number} defaultPort port
 * @return {Promise<number>} newPort
 */
function selectPortIsOccupied(defaultPort) {
    return detectPort(defaultPort).then(newPort => {
        return new Promise(resolve => {
            if (newPort === defaultPort) {
                resolve(defaultPort);
            }
            if (process.platform !== 'win32' && defaultPort < 1024 && !isRoot()) {
                // eslint-disable-next-line no-console
                console.log(
                    chalk.yellow(
                        `Admin permissions are required to run a server on a port below 1024. try port: ${newPort}`,
                    ),
                );
            } else {
                // eslint-disable-next-line no-console
                console.log(
                    chalk.yellow(`port: ${defaultPort} was occupied, try port: ${newPort}`),
                );
            }
            resolve(newPort);
        });
    });
}

module.exports = selectPortIsOccupied;
