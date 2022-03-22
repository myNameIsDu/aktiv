const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const checkRequiredFiles = require('../../utils/checkRequiredFiles');

const filePath = path.resolve(__dirname, './testFile.js');

describe('utils/checkRequiredFiles', () => {
    describe('当文件不存在时', () => {
        it('当输入一个不存在文件应该log 错误信息', () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

            checkRequiredFiles([filePath]);
            expect(spy.mock.calls[0][0]).toBe(chalk.red('Could not find a required file.'));
        });
        it('当输入一个不存在的文件应该返回false', () => {
            expect(checkRequiredFiles([filePath])).toBe(false);
        });
    });

    describe('当文件存在时', () => {
        beforeEach(() => {
            fs.writeFileSync(filePath, '');
        });
        afterEach(() => {
            fs.unlinkSync(filePath);
        });
        it('当输入一个存在的文件应该返回true', () => {
            expect(checkRequiredFiles([filePath])).toBe(true);
        });
    });
});
