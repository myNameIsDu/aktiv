#!/usr/bin/env node
const commander = require("commander");
const packInfo = require("../package.json");


commander
    .version(packInfo.version)
    .usage("<command> [options]")
    .command("init", "init a app with template")
    .command('build', "build app width webpack")

commander.parse();
