import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isString } from '../utils/isType';
import { get } from '../utils/get';

export type OriginSelectorType<S, T> = (state: S) => T;

export type OriginEqualFnType<T> = (left: T, right: T) => boolean;

export type SelectorTypes<S, T> = OriginSelectorType<S, T> | string;

function useAktivSelector<S extends Record<string, unknown>, T = unknown>(
    selector: SelectorTypes<S, T>,
    equalityFn?: OriginEqualFnType<T>,
): T {
    const reduxSelector = useMemo<OriginSelectorType<S, T>>(() => {
        if (typeof selector === 'function') {
            return selector;
        }

        return (state: S): T => {
            const [key, ...path] = isString(selector) ? (selector as string).split('.') : selector;

            if (path.length) {
                return get(state[key], path) as any;
            }

            return state[key] as any;
        };
    }, [selector]);

    return useSelector<S, T>(reduxSelector, equalityFn);
}

export default useAktivSelector;
