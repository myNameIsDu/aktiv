import isType from 'kind-of';

export { isType };

export const isString = (s: unknown): s is string => {
    return isType(s) === 'string';
};
export const isPromise = (s: unknown): s is Promise<any> => {
    return isType(s) === 'promise';
};
