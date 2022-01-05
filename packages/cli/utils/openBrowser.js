const { execSync, spawn } = require('child_process');
const open = require('open');
const isWsl = require('is-wsl');
const chalk = require('chalk');

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

    if (isWsl) {
        const cliArguments = [url];
        const command = 'xdg-open';

        try {
            const subprocess = spawn(command, cliArguments);

            subprocess.unref();

            return true;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(
                chalk.red(`
            Start Error:
                 Aktiv Cli detected that you have not installed ${chalk.underline.bgBlue(
                     'xdg-open',
                 )},You can try to ${chalk.underline.bgBlue(
                    'sudo apt-get install xdg-open',
                )}  to install and then start again
            `),
            );
            // Don't continue

            return false;
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
