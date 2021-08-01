import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';
import renderRoutes from './router/render-routers';
import type { RouteItem } from './index';
import type { ReactElement } from 'react';

type PluginRenderType = (children?: ReactElement, opt?: PluginOpt, route?: any) => ReactElement;

export interface Plugin {
    name: string;
    outer?: PluginRenderType;
    inner?: PluginRenderType;
    action?: any;
}
export interface PluginOpt {
    pluginSortIndex?: number;
    [x: string]: any;
}
export interface PluginItem {
    opt?: PluginOpt;
    plugin: Plugin;
}

const plugins: PluginItem[] = [];
const pluginActions: any = {};

export function pluginsRegistry(item: PluginItem): void {
    const { plugin, opt = {} } = item;
    const { action, name } = plugin;

    plugins.push(item);
    let thisAction = action;

    if (opt.action) {
        thisAction = opt.action;
    }
    if (thisAction) {
        pluginActions[name] = action;
    }
}

interface WrapperInitPropsType {
    hash?: boolean;
    routes: Array<RouteItem>;
}
type typeType = 'inner' | 'outer';
const pluginsWrapper = (type: typeType, children: ReactElement, route: RouteItem): ReactElement => {
    let wrapper = children;

    plugins.forEach(item => {
        const { plugin, opt } = item;
        const wrapperMethod = plugin[type];

        if (typeof wrapperMethod === 'function') {
            wrapper = wrapperMethod(wrapper, opt, route);
        }
    });

    return wrapper;
};
const renderRoutesPluginWrapper = (wrapper: ReactElement, route: RouteItem): ReactElement =>
    pluginsWrapper('inner', wrapper, route);

const routeWrapper = ({ hash, routes }: WrapperInitPropsType): JSX.Element => {
    const Router = hash ? HashRouter : BrowserRouter;

    const APP = () => (
        <Router>
            <Routes>{renderRoutes(routes, renderRoutesPluginWrapper)}</Routes>
        </Router>
    );

    return <APP />;
};

const WrapperInit = ({ hash, routes }: WrapperInitPropsType): JSX.Element => {
    return routeWrapper({ hash, routes });
};

export default WrapperInit;
