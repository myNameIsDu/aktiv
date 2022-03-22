const fs = require('fs');
const path = require('path');

class ExternalScriptsPlugin {
    // options = {externalScripts, externalStylesheets}
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        // Hook into the compilation
        compiler.hooks.compilation.tap('ExternalScriptsPlugin', compilation => {
            compilation.externalScripts = this.options.externalScripts.map(
                this.resolveScripts,
                this,
            );
            compilation.externalStylesheets = this.options.externalStylesheets.map(
                this.resolveStyles,
                this,
            );
        });
    }

    resolveScripts(source) {
        return this.resolve(source, (uri, innerHtml = undefined, attr = '') => {
            if (innerHtml) {
                return `<script type="text/javascript" ${attr}>${innerHtml}</script>`;
            }
            if (uri) {
                return `<script type="text/javascript" src="${uri}" ${attr}></script>`;
            }
        });
    }

    resolveStyles(source) {
        return this.resolve(source, (uri, innerHtml = undefined, attr = '') => {
            if (innerHtml) {
                return `<style type="text/css" ${attr}>${innerHtml}</style>`;
            }
            if (uri) {
                return `<link href="${uri}" ${attr} rel="stylesheet"/>`;
            }
        });
    }

    // eslint-disable-next-line class-methods-use-this
    resolve(source, callback) {
        if (!source) {
            return;
        }
        // link
        if (source.uriType === 'link') {
            return callback(source.uri, null, source.attr);
        }
        // localite
        if (source.uriType === 'local') {
            const innerHtml = fs.readFileSync(path.join(process.cwd(), source.uri));

            return callback(null, innerHtml, source.attr);
        }
    }
}

module.exports = ExternalScriptsPlugin;
