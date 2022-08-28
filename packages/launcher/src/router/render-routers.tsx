import type { ComponentType, ReactElement, ReactNode } from 'react';
import loadable from 'react-loadable';
import { Route, Navigate, type RouteProps } from 'react-router-dom';
import loading from './loading';
import WrapperRoute from './wrapper-route';
import type { RouteItem, DynamicImportType } from '../module/app';

type PluginRenderType = (w: ReactElement, r: RouteItem) => ReactElement;

const renderRoutes = (
    routes: Array<RouteItem> | undefined,
    pluginRender: PluginRenderType,
): Array<ReactNode> => {
    if (!routes) {
        return [];
    }

    return routes.map(item => {
        const { path, component, lazy, children, title, redirect, index, caseSensitive } = item;

        // RedirectRouteItem
        if (!component && redirect) {
            const C = <Navigate to={redirect} />;

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return wrapperRoute({ path, element: C }, pluginRender);
        }
        let Com = component;

        if (Com) {
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
            return wrapperRoute(
                { path, children, element: pluginInnerWrapper, index, caseSensitive },
                pluginRender,
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return wrapperRoute(
            { path, children, element: undefined, index, caseSensitive },
            pluginRender,
        );
    });
};

interface wrapperRouteParams extends RouteProps {
    children?: Array<RouteItem>;
}
const wrapperRoute = (
    { path, element, children, index, caseSensitive }: wrapperRouteParams,
    pluginRender: PluginRenderType,
) => {
    return (
        <Route key={path} index={index} caseSensitive={caseSensitive} path={path} element={element}>
            {renderRoutes(children, pluginRender)}
        </Route>
    );
};

export default renderRoutes;
