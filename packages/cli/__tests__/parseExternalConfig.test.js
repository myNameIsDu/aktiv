const parseExternalConfig = require('../ak-webpack-config/lib/parseExternalConfig');
const { proBuildEnv, devBuildEnv, localBuildEnv } = require('../config/index');

const httpsRemotePath = 'https://xxxx';
const httpRemotePath = 'http://xxxx';
const currentDirPath = './xxx';
const topDirPath = '../xx';
const emptyReturn = { externalScripts: [], externalStylesheets: [] };
const httpsLinkReturn = {
    externalScripts: [{ uri: httpsRemotePath, uriType: 'link', attr: '' }],
    externalStylesheets: [],
};
const httpLinkReturn = {
    externalScripts: [{ uri: httpRemotePath, uriType: 'link', attr: '' }],
    externalStylesheets: [],
};
const currentLocalReturn = {
    externalScripts: [{ uri: currentDirPath, uriType: 'local', attr: '' }],
    externalStylesheets: [],
};
const topLocalReturn = {
    externalScripts: [{ uri: topDirPath, uriType: 'local', attr: '' }],
    externalStylesheets: [],
};

describe('parseExternalConfig', () => {
    it('默认应该返回空', () => {
        expect(parseExternalConfig({})).toEqual(emptyReturn);
    });
    it('输入buildEnv为localBuildEnv应该返回空', () => {
        expect(
            parseExternalConfig({
                externalScripts: [httpsRemotePath],
                buildEnv: localBuildEnv,
            }),
        ).toEqual(emptyReturn);
    });
    it('输入buildEnv为devBuildEnv应该返回空', () => {
        expect(
            parseExternalConfig({
                externalScripts: [httpsRemotePath],
                buildEnv: devBuildEnv,
            }),
        ).toEqual(emptyReturn);
    });
    it('输入buildEnv为proBuildEnv应该返回解析数据', () => {
        expect(
            parseExternalConfig({
                externalScripts: [httpsRemotePath],
                buildEnv: proBuildEnv,
            }),
        ).not.toEqual(emptyReturn);
    });
    it('输入buildEnv为其它值应该返回空', () => {
        expect(
            parseExternalConfig({
                externalScripts: [httpsRemotePath],
                // @ts-expect-error 测试输入其它值
                buildEnv: 'xxx',
            }),
        ).toEqual(emptyReturn);
    });

    it('不输入buildEnv默认应该返回空', () => {
        expect(
            parseExternalConfig({
                externalScripts: [httpsRemotePath],
            }),
        ).toEqual(emptyReturn);
    });

    const wrapperProEnv = v => {
        return parseExternalConfig({
            ...v,
            buildEnv: proBuildEnv,
        });
    };

    describe('输入字符串uri', () => {
        it('输入https开头应当返回type为link', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [httpsRemotePath],
                }),
            ).toEqual(httpsLinkReturn);
        });
        it('输入http开头应当返回type为link', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [httpRemotePath],
                }),
            ).toEqual(httpLinkReturn);
        });
        it('输入./开头的应该返回type为local', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [currentDirPath],
                }),
            ).toEqual(currentLocalReturn);
        });
        it('输入../开头的应该返回type为local', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [topDirPath],
                }),
            ).toEqual(topLocalReturn);
        });
        it('输入其它应该返回空', () => {
            expect(
                wrapperProEnv({
                    externalScripts: ['xxxxxx'],
                }),
            ).toEqual(emptyReturn);
        });
    });

    describe('输入uri对象', () => {
        const wrapperItem = (type, force, attr = '') => {
            return {
                src: 'xxx',
                type,
                force,
                attr,
            };
        };
        const returnItem = (type, attr = '') => {
            return {
                attr,
                uri: 'xxx',
                uriType: type,
            };
        };

        it('输入type为link应该返回link', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [wrapperItem('link')],
                }),
            ).toEqual({
                externalScripts: [returnItem('link')],
                externalStylesheets: [],
            });
        });
        it('输入type为local应该返回type为local', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [wrapperItem('local')],
                }),
            ).toEqual({
                externalScripts: [returnItem('local')],
                externalStylesheets: [],
            });
        });
        it('输入其它type应该返回空', () => {
            expect(
                wrapperProEnv({
                    externalScripts: [wrapperItem('xxx')],
                }),
            ).toEqual(emptyReturn);
        });
        it('输入force在默认dev环境下应该返回解析数据', () => {
            expect(
                parseExternalConfig({
                    externalScripts: [wrapperItem('local', true)],
                }),
            ).toEqual({
                externalScripts: [returnItem('local')],
                externalStylesheets: [],
            });
        });
        it('不输入在默认dev环境下应该空', () => {
            expect(
                parseExternalConfig({
                    externalScripts: [wrapperItem('local')],
                }),
            ).toEqual(emptyReturn);
        });
        it('传入attr应该返回attr', () => {
            expect(
                parseExternalConfig({
                    externalScripts: [wrapperItem('local', true, 'hello')],
                }),
            ).toEqual({
                externalScripts: [returnItem('local', 'hello')],
                externalStylesheets: [],
            });
        });
    });
});
