import { isString, isPromise } from '../../src/utils/isType';

describe('Test Kit For isType', () => {
    it('Input string value, should return true', () => {
        expect(isString('test')).toBeTruthy();
    });

    it('Input promise value, should return true', () => {
        expect(isPromise(Promise.resolve(1))).toBeTruthy();
    });
});
