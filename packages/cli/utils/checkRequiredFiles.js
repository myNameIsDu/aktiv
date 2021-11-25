const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * @param {string[]} files file array
 * @return {boolean} files is exist
 */
function checkRequiredFiles(files) {
    /** @type {string} **/
    let currentFilePath = '';

    try {
        files.forEach(filePath => {
            currentFilePath = path.resolve(filePath);
            fs.accessSync(currentFilePath, fs.constants.F_OK);
        });

        return true;
    } catch (err) {
        const dirName = path.dirname(currentFilePath);
        const fileName = path.basename(currentFilePath);

        /* eslint-disable no-console */
        console.error(chalk.red('Could not find a required file.'));
        console.error(chalk.red('  Name: ') + chalk.cyan(fileName));
        console.error(chalk.red('  Searched in: ') + chalk.cyan(dirName));
        /* eslint-enable no-console */

        return false;
    }
}

module.exports = checkRequiredFiles;
