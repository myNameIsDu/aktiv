const url = require('url');

/**
 * @param {string} protocol protocol
 * @param {string} host host
 * @param {number} port port
 * @param {string} pathname pathname
 * @return {string} return
 */
function prepareUrls(protocol, host, port, pathname = '/') {
    const formatUrl = hostname => {
        const baseUrl = `${protocol}${hostname}${port}/`;

        return new url.URL(pathname, baseUrl).href;
    };

    // 是否是未指定的ip
    const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
    // eslint-disable-next-line init-declarations
    let prettyHost;

    if (isUnspecifiedHost) {
        prettyHost = 'localhost';
    } else {
        prettyHost = host;
    }

    return formatUrl(prettyHost); // localhost加端口
}

module.exports = prepareUrls;
