const shelljs = require('shelljs');
const chalk = require('chalk');

class ErrorUtil {
    /**
     * @desc Automatically catch errors and print them on the shell
     * @param {Function} successCb success callback
     * @param {Function} [failCb = undefined] fail callback
     * @returns {void}
     */
    autoCatchErrToPrint(successCb, failCb) {
        try {
            if (typeof successCb === 'function') {
                successCb();
            }
        } catch (/** @type {any} */ e) {
            this.printIn(e);
            if (typeof failCb === 'function') {
                failCb();
            }
        }
    }

    /**
     * @param {Object} shellRes shell result
     * @param {string|Error} error shell error or some err message
     * @param {Function} [cb = undefined] error callback
     * @returns {void}
     */
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

    /**
     * @param {string|Error} err err info
     * @returns {void}
     */
    printIn(err) {
        shelljs.echo(chalk.red(err));
    }
}

module.exports = ErrorUtil;
