const url = require('url');

/**
 * @param {string} protocol protocol
 * @param {string} host host
 * @param {number} port port
 * @param {string} pathname pathname
 * @return {string} return
 */
function prepareUrls(protocol, host, port, pathname = '/') {
    const formatUrl = hostname =>
        url.format({
            protocol,
            hostname,
            port,
            pathname,
        });

    // 是否是未指定的ip
    const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
    // eslint-disable-next-line init-declarations
    let prettyHost;

    if (isUnspecifiedHost) {
        prettyHost = 'localhost';
    } else {
        prettyHost = host;
    }
    const localUrlForBrowser = formatUrl(prettyHost);

    return localUrlForBrowser; // localhost加端口
}

module.exports = prepareUrls;
