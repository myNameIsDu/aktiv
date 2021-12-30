const { join } = require('path');

module.exports.getExternals = function getExternals({
    cwd = process.cwd(),
    extraExternals = [],
    needFilterPkg = true,
}) {
    let pkg = {};

    try {
        pkg = require(join(cwd, 'package.json')); // eslint-disable-line
        // eslint-disable-next-line no-empty
    } catch (e) {}

    if (!needFilterPkg) {
        return [...extraExternals];
    }

    return [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        ...extraExternals,
    ];
};
