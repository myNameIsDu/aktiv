import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { isString } from '../utils/isType';
import { get } from '../utils/get';

export type OriginSelectorType = Parameters<typeof useSelector>[0];

export type OriginEqualFnType = Parameters<typeof useSelector>[1];

export type SelectorTypes = OriginSelectorType | string;

function useAktivSelector<T>(selector: SelectorTypes, equalityFn?: OriginEqualFnType): T {
    const { current: reduxSelector } = useRef<() => typeof selector>(() => {
        if (typeof selector === 'function') {
            return selector;
        }

        return state => {
            const [key, ...path] = isString(selector) ? (selector as string).split('.') : selector;

            if (path.length) {
                return get((state as Record<string, unknown>)[key], path);
            }

            return (state as Record<string, unknown>)[key];
        };
    });

    return useSelector(reduxSelector() as OriginSelectorType, equalityFn) as T;
}

export default useAktivSelector;
