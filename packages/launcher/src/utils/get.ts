import { isType } from './isType';

function basePath(path: string[] | string): string[] {
    // 若是数组，则直接返回
    if (Array.isArray(path)) {
        return path;
    }

    return path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
}

export function get(object: unknown, path: string | string[], defaultValue?: unknown): unknown {
    // 判断 object 是否是数组或者对象，否则直接返回默认值 defaultValue
    if (typeof object !== 'object' || isType(object) === null) {
        return defaultValue;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        basePath(path).reduce((o, k) => ((o || {}) as Record<string, unknown>)[k], object) ||
        defaultValue
    );
}
