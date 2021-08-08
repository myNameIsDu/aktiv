import isType from 'kind-of';

export { isType };

export const isString = (s: unknown): boolean => {
    return isType(s) === 'string';
};

export const isPromise = (s: unknown): boolean => {
    return isType(s) === 'promise';
};
