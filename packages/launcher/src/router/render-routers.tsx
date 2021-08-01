import { ReactElement, ReactNode } from 'react';
import { Route, Navigate } from 'react-router-dom';
import loadable from 'react-loadable';
import loading from './loading';
import WrapperRoute from './wrapper-route';
import type { RouteItem, DynamicImportType } from '../index';
import type { ComponentType } from 'react';
import type { RouteProps } from 'react-router';

type PluginRenderType = (w: ReactElement, r: RouteItem) => ReactElement;

const renderRoutes = (
    routes: Array<RouteItem> | undefined,
    pluginRender: PluginRenderType,
): Array<ReactNode> => {
    if (!routes) {
        return [];
    }

    return routes!.map(item => {
        const { path, component, lazy, children, title, redirect } = item;

        // RedirectRouteItem
        if (!component && redirect) {
            const C = <Navigate to={redirect} />;

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return wrapperRoute({ path, element: C }, pluginRender);
        }
        let Com = component;

        if (lazy) {
            Com = loadable({
                loader: component as () => DynamicImportType,
                loading,
            });
        }
        const C = Com as ComponentType;
        const baseWrapperC = (
            <WrapperRoute redirect={redirect} title={title}>
                <C />
            </WrapperRoute>
        );
        const pluginInnerWrapper = pluginRender(baseWrapperC, item);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return wrapperRoute({ path, children, element: pluginInnerWrapper }, pluginRender);
    });
};

interface wrapperRouteParams extends RouteProps {
    children?: Array<RouteItem>;
}
const wrapperRoute = (
    { path, element, children }: wrapperRouteParams,
    pluginRender: PluginRenderType,
) => {
    return (
        <Route key={path} path={path} element={element}>
            {renderRoutes(children, pluginRender)}
        </Route>
    );
};

export default renderRoutes;
