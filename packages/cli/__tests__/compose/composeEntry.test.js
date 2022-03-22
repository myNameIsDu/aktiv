const path = require('path');
const schema = require('../../ak-webpack-config/lib/baseSchema');
const { composeEntry } = require('../../ak-webpack-config/lib/compose/index');

describe('composeEntry', () => {
    const workDir = './';

    it('inputEntry为undefined应该返回默认值', () => {
        const entry = composeEntry(workDir, undefined);
        const defaultEntry = schema.entry.default(workDir);

        expect(entry).toEqual(defaultEntry);
    });
    describe('类型校验', () => {
        it.each([
            ['string[]', ['./xxx']],
            ['{[x]:string}', { x: './x' }],
            ['string', './xx'],
        ])('输入 %s应该正常处理', (type, inputEntry) => {
            expect(() => {
                composeEntry(workDir, inputEntry);
            }).not.toThrowError();
        });
        it.each([
            ['{}[]', [{}]],
            ['{[x]:{}}', { x: {} }],
        ])('输入value不为string的类型 %s 应该报错', (type, inputEntry) => {
            expect(() => {
                // @ts-expect-error  测试输入错误值
                composeEntry(workDir, inputEntry);
            }).toThrowError(/an entry must be a/);
        });

        it.each([
            ['number', 123],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            ['function', () => {}],
            ['null', null],
            ['boolean', true],
        ])('输入其它类型值 %s 应该报错', (type, inputEntry) => {
            expect(() => {
                // @ts-expect-error  测试输入错误值
                composeEntry(workDir, inputEntry);
            }).toThrowError(/input's entry is invalid/);
        });
    });

    it('输入字符串应该返回字符串与workDir的resolve', () => {
        const iptEntry = './index.js';
        const entry = composeEntry(workDir, iptEntry);

        expect(entry).toBe(path.resolve(workDir, iptEntry));
    });

    it('输入string[]应该每个item与workDir的resolve返回', () => {
        const iptEntry = ['./a.js', './c.js', './d.js'];
        const entry = composeEntry(workDir, iptEntry);

        expect(entry).toEqual(iptEntry.map(v => path.resolve(workDir, v)));
    });

    it('输入{[x]:string}应该每个item与workDir的resolve返回', () => {
        const iptEntry = { a: './a.js', c: './c.js', b: './d.js' };
        const entry = composeEntry(workDir, iptEntry);

        expect(entry).toEqual(
            Object.keys(iptEntry).reduce(
                (c, v) => ({ ...c, [v]: path.resolve(workDir, iptEntry[v]) }),
                {},
            ),
        );
    });
});
