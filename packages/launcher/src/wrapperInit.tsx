import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';
import renderRoutes from './router/render-routers';
import { Provider } from 'react-redux';
import type { RouteItem } from './index';
import type { Store, ReducerConfig, ReducerConfigItem } from './store';
import type { ReactElement } from 'react';

type PluginRenderType = (children: ReactElement, opt?: PluginOpt, route?: any) => ReactElement;

export interface Plugin {
    name: string;
    outer?: PluginRenderType;
    inner?: PluginRenderType;
    reducerConfig?: ReducerConfigItem;
}
export interface PluginOpt {
    pluginSortIndex?: number;
    reducers?: ReducerConfigItem;
    [x: string]: any;
}
export interface PluginItem {
    opt?: PluginOpt;
    plugin: Plugin;
}

const plugins: PluginItem[] = [];

export const pluginReducers: ReducerConfig = {};

export function pluginsRegistry(item: PluginItem): void {
    const { plugin, opt = {} } = item;
    const { reducerConfig, name } = plugin;

    plugins.push(item);
    let thisReducerConfig = reducerConfig;

    if (opt.reducers) {
        thisReducerConfig = opt.reducers;
    }
    if (thisReducerConfig) {
        pluginReducers[name] = thisReducerConfig;
    }
}

interface WrapperInitPropsType {
    hash?: boolean;
    routes: Array<RouteItem>;
    store?: Store;
}
type typeType = 'inner' | 'outer';
const pluginsWrapper = (
    type: typeType,
    children: ReactElement,
    route?: RouteItem,
): ReactElement => {
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

type RouteWrapperParamsType = Omit<WrapperInitPropsType, 'store'>;
const routeWrapper = ({ hash, routes }: RouteWrapperParamsType): JSX.Element => {
    const Router = hash ? HashRouter : BrowserRouter;

    const APP = () => (
        <Router>
            <Routes>{renderRoutes(routes, renderRoutesPluginWrapper)}</Routes>
        </Router>
    );

    return <APP />;
};

const WrapperInit = ({ hash, routes, store }: WrapperInitPropsType): JSX.Element => {
    const wrapperInner = routeWrapper({ hash, routes });
    const wrapperOuter = pluginsWrapper('outer', wrapperInner);

    if (store) {
        return <Provider store={store}>{wrapperOuter}</Provider>;
    }

    return wrapperOuter;
};

export default WrapperInit;
