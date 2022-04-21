import { useCallback, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import useRouter from './use-router';

export type SearchProps = Partial<Record<string, unknown>>;

export type UseEffectRouterReturns = {
    redirect(search?: SearchProps): void;
    replace(search?: SearchProps): void;
};

const useEffectRouter = (): UseEffectRouterReturns => {
    const { pathname, state } = useLocation();
    const router = useRouter();
    const params = useSearchParams();

    const redirect = useCallback(
        search => {
            router.redirect(
                pathname,
                {
                    ...params,
                    ...search,
                },
                state,
            );
        },
        [params, pathname, router, state],
    );

    const replace = useCallback(
        search => {
            router.replace(
                pathname,
                {
                    ...params,
                    ...search,
                },
                state,
            );
        },
        [params, pathname, router, state],
    );

    return useMemo(
        () => ({
            redirect,
            replace,
        }),
        [redirect, replace],
    );
};

export default useEffectRouter;
