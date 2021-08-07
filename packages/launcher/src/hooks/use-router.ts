import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export type UseRouterReturns = {
    redirect(path: string, state?: UseRouterState): void;
    replace(path: string, state?: UseRouterState): void;
};

export type UseRouterState = Partial<Record<string, unknown>>;

function useRouter(): UseRouterReturns {
    const navigate = useNavigate();

    const pushPath = useCallback(
        (path: string, state?: UseRouterState) => {
            return navigate(path, {
                state,
            });
        },
        [navigate],
    );

    const replacePath = useCallback(
        (path: string, state?: UseRouterState) => {
            return navigate(path, {
                replace: true,
                state,
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
