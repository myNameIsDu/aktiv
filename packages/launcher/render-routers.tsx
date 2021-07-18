import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import loading from './loading';
import type { RouteItem, PropsType } from './index';
import type { ComponentType } from 'react';

export default (routes: Array<RouteItem>): Array<ReactNode> => {
    return routes.map(item => {
        const { path, component, lazy } = item;

        const props: PropsType = {};

        if (lazy) {
            const LoadCom = loadable({
                loader: component as () => Promise<ComponentType<PropsType>>,
                loading,
            });

            if (item.children) {
                props.routes = item.children;
            }

            return <Route key={path} path={path} element={<LoadCom {...props} />} />;
        }
        if (item.children) {
            props.routes = item.children;
        }
        const Com = component as ComponentType<PropsType>;

        return <Route key={path} path={path} element={<Com {...props} />} />;
    });
};
