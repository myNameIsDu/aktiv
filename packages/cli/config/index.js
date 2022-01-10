const defaultWorkDir = process.cwd(); // 当前工作目录
const defaultConfigFile = './ak.config.js'; // 配置文件路径
const defaultPort = 8080; // 默认端口
const devBuildEnv = 'development';
const proBuildEnv = 'production';
const localBuildEnv = 'local';
const browserTarget = 'browser';
const serverTarget = 'node';
const defaultTarget = browserTarget;

/** @typedef  {['node', 'browser']} TargetListType */
/** @type {TargetListType} */
const supperTargetList = [serverTarget, defaultTarget];
/** @typedef  {['local', 'development', 'production']} EnvListType */
/** @type {EnvListType} */
const supperEnvList = [localBuildEnv, devBuildEnv, proBuildEnv];

module.exports = {
    defaultWorkDir,
    defaultConfigFile,
    defaultPort,
    localBuildEnv,
    devBuildEnv,
    proBuildEnv,
    defaultTarget,
    supperTargetList,
    browserTarget,
    serverTarget,
    supperEnvList,
};
