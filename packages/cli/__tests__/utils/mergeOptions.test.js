const mergeOptions = require('../../utils/mergeOptions');

describe('mergeOptions', () => {
    it.each([
        [{}, { a: '123' }, { a: '123' }],
        [{ a: '456' }, { a: '123' }, { a: '123' }],
        [{ a: ['456'] }, { a: '123' }, { a: ['456', '123'] }],
        [{ a: { b: '456' } }, { a: { c: '123' } }, { a: { b: '456', c: '123' } }],
        [{ a: { b: '456' } }, { a: { b: '123' } }, { a: { b: '123' } }],
        [{ a: '456' }, { a: { b: '123' } }, { a: { b: '123' } }],
    ])('输入 %o, %o 应该返回 %o', (toOps, fromOps, expectedResults) => {
        const result = mergeOptions(toOps, fromOps);

        expect(result).toEqual(expectedResults);
    });
});
