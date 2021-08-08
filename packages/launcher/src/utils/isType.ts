import isType from 'kind-of';

export { isType };

export const isString = (s: string): boolean => {
    return isType(s) === 'string';
};

export const isPromise = (s: Promise<unknown>): boolean => {
    return isType(s) === 'promise';
};
