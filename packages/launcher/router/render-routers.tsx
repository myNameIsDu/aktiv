import { ReactNode } from 'react';
import { Route, Navigate } from 'react-router-dom';
import loadable from 'react-loadable';
import loading from './loading';
import WrapperRoute from './wrapper-route';
import type { RouteItem, DynamicImportType } from '../index';
import type { ComponentType } from 'react';
import type { RouteProps } from 'react-router';

const renderRoutes = (routes: Array<RouteItem> | undefined): Array<ReactNode> => {
    if (!routes) {
        return [];
    }

    return routes!.map(item => {
        const { path, component, lazy, children, title, redirect } = item;

        // RedirectRouteItem
        if (!component && redirect) {
            const C = <Navigate to={redirect} />;

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return wrapperRoute({ path, element: C });
        }
        let Com = component;

        if (lazy) {
            Com = loadable({
                loader: component as () => DynamicImportType,
                loading,
            });
        }
        const C = Com as ComponentType;
        const wrapperC = (
            <WrapperRoute redirect={redirect} title={title}>
                <C />
            </WrapperRoute>
        );

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return wrapperRoute({ path, children, element: wrapperC });
    });
};

interface wrapperRouteParams extends RouteProps {
    children?: Array<RouteItem>;
}
const wrapperRoute = ({ path, element, children }: wrapperRouteParams) => {
    return (
        <Route key={path} path={path} element={element}>
            {renderRoutes(children)}
        </Route>
    );
};

export default renderRoutes;
