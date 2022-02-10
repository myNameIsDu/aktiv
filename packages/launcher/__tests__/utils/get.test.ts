import { get } from '../../src/utils/get';

describe('get method test suit', () => {
    it('when get source data is not object, it should can return defaultValue', () => {
        const dataSource = undefined;

        const getData = get(dataSource, 'xxx', 123);

        expect(getData).toEqual(123);
    });

    it('when get source data is object, it should can return truly data', () => {
        const dataSource = { name: '张三' };

        const getData = get(dataSource, 'name', 123);

        expect(getData).toEqual('张三');
    });

    it('when get source data is object, path is array, it should can return truly data', () => {
        const dataSource = { name: '张三' };

        const getData = get(dataSource, ['name'], 123);

        expect(getData).toEqual('张三');
    });

    it('when get source data is null, it should can return truly data', () => {
        const dataSource = null;

        const getData = get(dataSource, ['name'], 123);

        expect(getData).toEqual(123);
    });
});
