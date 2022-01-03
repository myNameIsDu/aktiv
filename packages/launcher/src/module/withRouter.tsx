import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRouter } from '../hooks';
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

const globalHistory = window.history;

export type AktivHistory = {
    go(): void;
    go(delta?: number): void;
    goBack(): void;
    goForward(): void;
};

const aktivHistory: AktivHistory = {
    go(delta?: number) {
        return globalHistory.go(delta);
    },
    goBack() {
        return globalHistory.back();
    },
    goForward() {
        return globalHistory.forward();
    },
};

function withRouter<CProps, R>(
    Com: ComponentType<CProps & HocExtraProps>,
): ForwardRefExoticComponent<PropsWithoutRef<CProps> & RefAttributes<R>> {
    return React.forwardRef<R, CProps>((props, ref) => {
        const routerLocation = useLocation();
        const params = useParams();
        const router = useRouter();
        const wrapperHistory = {
            ...aktivHistory,
            push: router.redirect,
            replace: router.replace,
            location: routerLocation,
        };
        const extraProps = {
            params,
            location: routerLocation,
            history: wrapperHistory,
            ...props,
        };

        return <Com {...extraProps} ref={ref} />;
    });
}

export default withRouter;
