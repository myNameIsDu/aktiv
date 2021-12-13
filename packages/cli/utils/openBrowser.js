const { execSync } = require('child_process');
const open = require('open');

/**
 * @param {string} url url
 * @return {boolean} return
 */
function startBrowserProcess(url) {
    const shouldTryOpenChromiumWithAppleScript = process.platform === 'darwin';

    if (shouldTryOpenChromiumWithAppleScript) {
        // Will use the first open browser found from list
        const supportedChromiumBrowsers = [
            'Google Chrome Canary',
            'Google Chrome',
            'Microsoft Edge',
            'Brave Browser',
            'Vivaldi',
            'Chromium',
        ];

        for (const chromiumBrowser of supportedChromiumBrowsers) {
            try {
                // Try our best to reuse existing tab
                // on OSX Chromium-based browser with AppleScript
                execSync(`ps cax | grep "${chromiumBrowser}"`);
                const command = `osascript openChrome.applescript "${encodeURI(
                    url,
                )}" "${chromiumBrowser}"`;

                execSync(command, {
                    cwd: __dirname,
                    stdio: 'ignore',
                });

                return true;
            } catch (err) {
                // Ignore errors.
            }
        }
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        open(url).catch(() => {}); // Prevent `unhandledRejection` error.

        return true;
    } catch (err) {
        return false;
    }
}

module.exports = startBrowserProcess;
