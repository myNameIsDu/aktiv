const isType = (s: any): string => {
    return Object.prototype.toString.call(s).slice(8, -1);
};

export const isString = (s: any) => {
    return isType(s) === 'String';
};

export const isPromise = (s: any): boolean => {
    return isType(s) === 'Promise';
};
