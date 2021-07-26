import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type UseRouterReturns = {
    redirect(path: string, params: Params): void;
};

type Params = Partial<Record<string, unknown>>;

function useRouter(): UseRouterReturns {
    const navigate = useNavigate();

    const pushPath = useCallback(
        (path: string, params: Params = {}) => {
            return navigate(path, {
                state: params,
            });
        },
        [navigate],
    );

    const replacePath = useCallback(
        (path: string, params: Params = {}) => {
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
