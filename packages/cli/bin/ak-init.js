#!/usr/bin/env node
/* eslint-disable no-console */
const { program } = require('commander');
const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const { spawnSync } = require('child_process');

class AkInit {
    constructor() {
        /** @type {string} */
        this.projectName = '';
        /** @type {'npm'|'pnpm'|'yarn'} */
        this.packageManager = 'npm';
        /** @type {string} */
        this.fullPath = '';
        this.questionList = [
            {
                type: 'list',
                message: chalk.green('Which package manager do you want to use?'),
                choices: ['npm', 'yarn', 'pnpm'],
                name: 'packageManager',
            },
        ];
        /** @type {string} */
        this.originalDirectory = process.cwd();
    }

    init() {
        program
            .usage('<project-directory>')
            .arguments('<<project-directory>>')
            .action(name => {
                this.projectName = name;
                this.fullPath = path.resolve(process.cwd(), this.projectName);
            })
            .parse();
        if (this.detectProjectNameExist()) {
            this.ask();
        }
    }

    makeProject() {
        fse.ensureDirSync(this.fullPath);
        fse.copySync(path.resolve(__dirname, '../ak-template'), this.fullPath);
        const packageJSonPath = `${this.fullPath}/package.json`;
        const packageJSon = require(packageJSonPath);

        packageJSon.name = this.projectName;
        fse.writeFileSync(packageJSonPath, JSON.stringify(packageJSon, null, 4), 'utf-8');
    }

    install() {
        console.log();
        console.log(chalk.yellow('Installing packages. This might take a couple of minutes.'));
        spawnSync(this.packageManager, ['install'], { stdio: 'inherit' });
    }

    // eslint-disable-next-line class-methods-use-this
    gitInit() {
        spawnSync('git', ['init']);
    }

    start() {
        this.makeProject();
        process.chdir(this.fullPath);
        this.gitInit();
        this.install();
        process.chdir(this.originalDirectory);
        this.successfulLog();
    }

    successfulLog() {
        console.log();
        console.log(chalk.green(`Success! Created ${this.projectName}`));
        console.log('You can run several commands:');
        console.log();
        console.log(chalk.cyan(`ak`));
        console.log('   Starts the development server');
        console.log();
        console.log(chalk.cyan(`ak build`));
        console.log('   Bundles the app into static files for production');
        console.log();
        console.log('We suggest that you begin by typing:');
        console.log();
        console.log(chalk.cyan('  cd'), this.projectName);
        console.log(`  ${chalk.cyan('ak')}`);
    }

    ask() {
        inquirer.prompt(this.questionList).then(({ packageManager }) => {
            this.packageManager = packageManager;
            this.start();
        });
    }

    detectProjectNameExist() {
        try {
            fse.statSync(this.fullPath);
            console.error(chalk.red(`Folder ${this.fullPath} exists already.`));
            console.error(chalk.red('Remove it and try again. Or try some name else.'));
            process.exit(1);
        } catch (error) {
            // file not exist
            return true;
        }
    }
}

new AkInit().init();
