#!/usr/bin/env node
// @ts-ignore two different file
const { program } = require('commander');

const packInfo = require('../package.json');

program
    .version(packInfo.version)
    .usage('<command> [options]')
    .command('dev', 'run live-reloaded dev server', { isDefault: true })
    .command('build', 'build project')
    .command('init', 'init a project')
    .parse();
