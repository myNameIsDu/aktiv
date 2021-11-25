const LINK_RE = /^https?|^\/\//;
const LOCAL_RE = /^\.{0,2}\/(?!\/)/;
const { proBuildEnv, devBuildEnv } = require('../../config/index');

const typeInclude = ['local', 'link'];

/*
[
    'https://xxxx',
    './xxxx',
    {
        src:'',
        force?:boolean, // 表示是否dev环境也导入
        attr?:'xxx'//自定义属性
        type?:link | local  // 是否打包 默认根据 src 以http 开头 则为link   src为 .|.. / 则为local
    }
]
*/

/**
    @typedef {string | {src: string, force?: boolean, attr?: string, type?:'link'}} URIType
    @typedef {import('../../config/index').EnvListType[number]} EnvType
    @typedef {{uri: string, attr: string, uriType: 'link' | 'local'}} ParseResult
    @typedef {
        {externalScripts?: URIType[], externalStylesheets?: URIType[], buildEnv?: EnvType}
    } ParseExternalConfigParams
 */

/**
 * @param { URIType } uri uri
 * @param { EnvType } buildEnv buildEnv
 * @return {ParseResult | null} ParseResult
 */
function parseConfig(uri, buildEnv) {
    /**
     * @param {string} stringUri stringUri
     * @return {ParseResult|null} ParseResult
     */
    const parseURI = stringUri => {
        // link http...
        if (LINK_RE.test(stringUri)) {
            return {
                uri: stringUri,
                uriType: 'link',
                attr: '',
            };
        }

        // local file ./xx
        if (LOCAL_RE.test(stringUri)) {
            return {
                uri: stringUri,
                uriType: 'local',
                attr: '',
            };
        }

        return null;
    };

    if (typeof uri === 'string') {
        if (buildEnv !== proBuildEnv) {
            return null;
        }

        return parseURI(uri);
    } else if (typeof uri === 'object') {
        // make it possible to force type
        if (buildEnv !== proBuildEnv && !uri.force) {
            return null;
        }
        if (uri.type && typeInclude.includes(uri.type)) {
            return {
                uri: uri.src,
                attr: uri.attr || '',
                uriType: uri.type,
            };
        }
    }

    return null;
}

/**
 * @param {ParseExternalConfigParams} params params
 * @return {{ externalScripts:ParseResult[], externalStylesheets: ParseResult[] }} return parse result
 */
function parseExternalConfig(params) {
    const { externalScripts = [], externalStylesheets = [], buildEnv = devBuildEnv } = params;

    return {
        // @ts-ignore 这里报错为null 不能赋值给ParseResult，但是已经通过filter过滤掉了，目前未找到解决办法
        externalScripts: externalScripts
            .map(script => parseConfig(script, buildEnv))
            .filter(Boolean),
        // @ts-ignore 这里报错为null 不能赋值给ParseResult，但是已经通过filter过滤掉了，目前未找到解决办法
        externalStylesheets: externalStylesheets
            .map(styleSheet => parseConfig(styleSheet, buildEnv))
            .filter(Boolean),
    };
}

module.exports = parseExternalConfig;
