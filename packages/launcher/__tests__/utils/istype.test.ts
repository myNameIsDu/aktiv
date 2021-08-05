import { isString, isPromise } from '../../src/utils/isType';

describe('isType', () => {
    it('isString', () => {
        expect(isString(1)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(true)).toBe(false);
        expect(isString('123')).toBe(true);
        // eslint-disable-next-line no-new-wrappers
        expect(isString(new String('123'))).toBe(true);
        expect(isString({})).toBe(false);
        expect(isString([])).toBe(false);
        // eslint-disable-next-line no-new-func
        expect(isString(new Function())).toBe(false);
        // eslint-disable-next-line prefer-regex-literals
        expect(isString(new RegExp('123'))).toBe(false);
        // eslint-disable-next-line
        expect(isString(new Promise(() => {}))).toBe(false);
    });

    it('isPromise', () => {
        expect(isPromise(1)).toBe(false);
        expect(isPromise(undefined)).toBe(false);
        expect(isPromise(null)).toBe(false);
        expect(isPromise(true)).toBe(false);
        expect(isPromise('123')).toBe(false);
        // eslint-disable-next-line no-new-wrappers
        expect(isPromise(new String('123'))).toBe(false);
        expect(isPromise({})).toBe(false);
        expect(isPromise([])).toBe(false);
        // eslint-disable-next-line no-new-func
        expect(isPromise(new Function())).toBe(false);
        // eslint-disable-next-line prefer-regex-literals
        expect(isPromise(new RegExp('123'))).toBe(false);
        // eslint-disable-next-line
        expect(isPromise(new Promise(() => {}))).toBe(true);
    });
});
