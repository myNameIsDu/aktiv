import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRouter, useQuery } from '../hooks';
import type { Params } from 'react-router-dom';
import type { Location } from 'react-router';
import type { UseRouterReturns } from '../hooks';
import type {
    ComponentType,
    PropsWithoutRef,
    ForwardRefExoticComponent,
    RefAttributes,
} from 'react';

export type HocExtraProps = {
    location: Location;
    params: Params;
    history: {
        go: typeof history.go;
        goBack: typeof history.back;
        goForward: typeof history.forward;
        location: Location;
        push: UseRouterReturns['redirect'];
        replace: UseRouterReturns['replace'];
    };
};

function withRouter<CProps, R>(
    Com: ComponentType<CProps & HocExtraProps>,
): ForwardRefExoticComponent<PropsWithoutRef<CProps> & RefAttributes<R>> {
    return React.forwardRef<R, CProps>((props, ref) => {
        const routerLocation = useLocation();
        const params = useParams();
        const router = useRouter();
        const query = useQuery();
        const wrapperHistory = {
            go: window.history.go,
            goBack: window.history.back,
            goForward: window.history.forward,
            push: router.redirect,
            replace: router.replace,
            location: routerLocation,
        };
        const extraProps = {
            params,
            query,
            location: routerLocation,
            history: wrapperHistory,
            ...props,
        };

        return <Com {...extraProps} ref={ref} />;
    });
}

export default withRouter;
