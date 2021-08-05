const isType = (s: unknown): string => {
    return Object.prototype.toString.call(s).slice(8, -1);
};

export const isString = (s: unknown): boolean => {
    return isType(s) === 'String';
};

export const isPromise = (s: unknown): boolean => {
    return isType(s) === 'Promise';
};
