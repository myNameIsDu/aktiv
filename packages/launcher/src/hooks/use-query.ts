import { useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ProxyRef = {
    (target: any, object: ProxyHandler<never>): Record<string, any>;
};

function useQuery(): Record<string, unknown> {
    const proxyRef = useRef<ProxyRef>(
        (target: any, object: ProxyHandler<never>) => new Proxy(target, object),
    );

    const proxyTarget = useRef({});
    const [searchParams] = useSearchParams();

    const paramsHandler = useMemo(
        () => ({
            get(target: any, prop: string) {
                return searchParams.get(prop) || undefined;
            },
        }),
        [searchParams],
    );

    useEffect(() => {
        return () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            proxyRef.current = null;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            proxyTarget.current = null;
        };
    }, []);

    return proxyRef.current(proxyTarget.current, paramsHandler);
}

export default useQuery;
