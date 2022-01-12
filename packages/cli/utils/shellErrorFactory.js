const shelljs = require('shelljs');
const chalk = require('chalk');

class ErrorUtil {
    autoCatchErrToPrint(successCb, failCb) {
        try {
            if (typeof successCb === 'function') {
                successCb();
            }
        } catch (e) {
            this.printIn(e);
            if (typeof failCb === 'function') {
                failCb();
            }
        }
    }

    checkErrorToPrint(shellRes, error, cb) {
        const { code } = shellRes || {};

        if (code !== 0) {
            this.printIn(error);
            if (typeof cb === 'function') {
                cb();
            }
            process.exit(1);
        }
    }

    printIn(err) {
        shelljs.echo(chalk.red(err));
    }
}

module.exports = ErrorUtil;
