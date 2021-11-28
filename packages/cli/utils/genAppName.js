const throwError = require('./throwError');

/**
 * @param {string} pkgName pkgName
 * @return {string} appName
 */
function genAppName(pkgName) {
    if (!pkgName) {
        throwError('failed to gen owl config, app name is empty');
    }

    // remove scope
    if (pkgName.charAt(0) === '@') {
        const parts = pkgName.split('/');

        pkgName = parts.length > 1 ? parts[1] : parts[0];
    }

    return pkgName;
}

module.exports = genAppName;
