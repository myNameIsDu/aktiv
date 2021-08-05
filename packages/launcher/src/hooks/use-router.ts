import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export type UseRouterReturns = {
    redirect(path: string, params: UseRouterParams): void;
    replace(path: string, params: UseRouterParams): void;
};

export type UseRouterParams = Partial<Record<string, unknown>>;

function useRouter(): UseRouterReturns {
    const navigate = useNavigate();

    const pushPath = useCallback(
        (path: string, params: UseRouterParams = {}) => {
            return navigate(path, {
                state: params,
            });
        },
        [navigate],
    );

    const replacePath = useCallback(
        (path: string, params: UseRouterParams = {}) => {
            return navigate(path, {
                replace: true,
                state: params,
            });
        },
        [navigate],
    );

    return useMemo(
        () => ({
            redirect: pushPath,
            replace: replacePath,
        }),
        [pushPath, replacePath],
    );
}

export default useRouter;
