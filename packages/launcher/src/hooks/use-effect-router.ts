import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useQuery from './use-query';
import useRouter from './use-router';

export type SearchProps = Partial<Record<string, unknown>>;

export type UseEffectRouterReturns = {
    redirectEffect(search?: SearchProps): void;
    replaceEffect(search?: SearchProps): void;
};

const useEffectRouter = (): UseEffectRouterReturns => {
    const { pathname } = useLocation();
    const router = useRouter();
    const query = useQuery();

    const redirectEffect = useCallback(
        search => {
            router.redirect(pathname, {
                ...query,
                ...search,
            });
        },
        [query, pathname, router],
    );

    const replaceEffect = useCallback(
        search => {
            router.replace(pathname, {
                ...query,
                ...search,
            });
        },
        [query, pathname, router],
    );

    return useMemo(
        () => ({
            redirectEffect,
            replaceEffect,
        }),
        [redirectEffect, replaceEffect],
    );
};

export default useEffectRouter;
