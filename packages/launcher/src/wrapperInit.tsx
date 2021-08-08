import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';
import renderRoutes from './router/render-routers';
import { Provider } from 'react-redux';
import { globalRouterBasePath } from './utils/globalEnv';
import type { RouteItem } from './app';
import type { Store, ReducerConfig, ReducerConfigItem } from './store';
import type { ReactElement } from 'react';

export type PluginInnerRenderType = (
    children: ReactElement,
    route: RouteItem,
    opt?: PluginOpt,
) => ReactElement;

export type PluginOuterRenderType = (children: ReactElement, opt?: PluginOpt) => ReactElement;

export interface Plugin {
    name: string;
    outer?: PluginOuterRenderType;
    inner?: PluginInnerRenderType;
    reducerConfig?: ReducerConfigItem;
}
export interface PluginOpt {
    pluginSortIndex?: number;
    reducerConfig?: ReducerConfigItem;
    [x: string]: unknown;
}
interface PluginItem {
    opt?: PluginOpt;
    plugin: Plugin;
}
interface WrapperInitPropsType {
    hash?: boolean;
    routes: Array<RouteItem>;
    store: Store | null;
    routerBasePath?: string;
}
type RouteWrapperParamsType = Omit<WrapperInitPropsType, 'store'>;

type typeType = 'inner' | 'outer';

const plugins: PluginItem[] = [];

export const pluginReducers: ReducerConfig = {};

export function pluginsRegistry(item: PluginItem): void {
    const { plugin, opt = {} } = item;
    const { reducerConfig, name } = plugin;

    plugins.push(item);
    let thisReducerConfig = reducerConfig;

    if (opt.reducerConfig) {
        thisReducerConfig = opt.reducerConfig;
    }
    if (thisReducerConfig) {
        pluginReducers[name] = thisReducerConfig;
    }
}
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
            if (route) {
                // inner
                wrapper = wrapperMethod(wrapper, route, opt);
            } else {
                // outer
                wrapper = (wrapperMethod as PluginOuterRenderType)(wrapper, opt);
            }
        }
    });

    return wrapper;
};

const renderRoutesPluginWrapper = (wrapper: ReactElement, route: RouteItem): ReactElement =>
    pluginsWrapper('inner', wrapper, route);

const routeWrapper = ({ hash, routes, routerBasePath }: RouteWrapperParamsType): JSX.Element => {
    const Router = hash ? HashRouter : BrowserRouter;
    let basePath = '/';

    if (routerBasePath) {
        basePath = routerBasePath;
    }
    globalRouterBasePath.set(basePath);

    const APP = () => (
        <Router>
            <Routes basename={basePath}>{renderRoutes(routes, renderRoutesPluginWrapper)}</Routes>
        </Router>
    );

    return <APP />;
};

const WrapperInit = ({
    hash,
    routes,
    store,
    routerBasePath,
}: WrapperInitPropsType): JSX.Element => {
    const wrapperInner = routeWrapper({ hash, routes, routerBasePath });
    const wrapperOuter = pluginsWrapper('outer', wrapperInner);

    if (store) {
        return <Provider store={store}>{wrapperOuter}</Provider>;
    }

    return wrapperOuter;
};

export default WrapperInit;
