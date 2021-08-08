import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalRouterBasePath } from '../utils/globalEnv';

export type UseRouterReturns = {
    redirect(path: string, state?: UseRouterState): void;
    replace(path: string, state?: UseRouterState): void;
};

export type UseRouterState = Partial<Record<string, unknown>>;

function useRouter(): UseRouterReturns {
    const navigate = useNavigate();

    const pushPath = useCallback(
        (path: string, state?: UseRouterState) => {
            const basePath = globalRouterBasePath.get();
            const resultPath = path.startsWith('/') ? basePath + path : path;

            return navigate(resultPath, {
                state,
            });
        },
        [navigate],
    );

    const replacePath = useCallback(
        (path: string, state?: UseRouterState) => {
            const basePath = globalRouterBasePath.get();
            const resultPath = path.startsWith('/') ? basePath + path : path;

            return navigate(resultPath, {
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
