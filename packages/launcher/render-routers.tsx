import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import loading from './loading';
import type { RouteItem } from './index';
import type { ComponentType } from 'react';

export default (routes: Array<RouteItem>): Array<ReactNode> => {
    return routes.map(item => {
        const { path, component, lazy } = item;

        if (lazy) {
            const LoadCom = loadable({
                loader: component,
                loading,
            });

            return <Route key={path} path={path} element={<LoadCom />} />;
        }
        const Com = component as ComponentType;

        return <Route key={path} path={path} element={<Com />} />;
    });
};
