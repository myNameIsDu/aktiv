#!/usr/bin/env node
/* eslint-disable no-console */
const { program } = require('commander');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');

/** @type {string} */
let projectName = '';

program
    .usage('<project-directory>')
    .arguments('<<project-directory>>')
    .action(name => {
        console.log('projectName:', name);
        projectName = name;
    })
    .parse();

function directoryExist(folderPath) {
    try {
        fse.statSync(folderPath);
    } catch (e) {
        return false;
    }

    return true;
}
const fullPath = path.resolve(process.cwd(), projectName);

if (directoryExist(fullPath)) {
    console.error(chalk.red(`Folder ${fullPath} exists already.`));
    console.error(chalk.red('Remove it and try again. Or try some name else.'));
    process.exit(1);
}

const spinner = ora('downloading template');

spinner.start();
try {
    fse.ensureDirSync(fullPath);
    fse.copySync(path.resolve(__dirname, '../ak-template'), fullPath);
    const packageJSonPath = `${fullPath}/package.json`;
    const packageJSon = require(packageJSonPath);

    packageJSon.name = projectName;
    fse.writeFileSync(packageJSonPath, JSON.stringify(packageJSon, null, 4), 'utf-8');
    spinner.stop();
    console.log(chalk.green('init success'));
} catch (error) {
    spinner.stop();
    console.error(error);
    process.exit(1);
}
