import { useCallback, useMemo } from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

export type UseRouterReturns = {
    redirect(path: string, params?: Record<string, unknown>, state?: unknown): void;
    replace(path: string, params?: Record<string, unknown>, state?: unknown): void;
};

export type UseRouterState = Partial<Record<string, unknown>>;

function useRouter(): UseRouterReturns {
    const navigate = useNavigate();

    const redirect = useCallback(
        (path: string, params?: Record<string, unknown>, state?: UseRouterState) => {
            const [noSearchPath, search] = path?.split('?') || [];

            const originQuery = qs.parse(search, { ignoreQueryPrefix: true });
            const mergedQuery = { ...originQuery, ...(params || {}) };
            const finalSearch = qs.stringify(mergedQuery, { addQueryPrefix: true });

            return navigate(`${noSearchPath}${finalSearch}`, {
                state,
            });
        },
        [navigate],
    );

    const replace = useCallback(
        (path: string, params?: Record<string, unknown>, state?: UseRouterState) => {
            const [noSearchPath, search] = path?.split('?') || [];

            const originQuery = qs.parse(search, { ignoreQueryPrefix: true });
            const mergedQuery = { ...originQuery, ...(params || {}) };
            const finalSearch = qs.stringify(mergedQuery, { addQueryPrefix: true });

            return navigate(`${noSearchPath}${finalSearch}`, {
                replace: true,
                state,
            });
        },
        [navigate],
    );

    return useMemo(
        () => ({
            redirect,
            replace,
        }),
        [redirect, replace],
    );
}

export default useRouter;
