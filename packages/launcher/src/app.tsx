import ReactDOM from 'react-dom';
// import { hot } from 'react-hot-loader';
import { createStore, initialStore } from './store';
import WrapperInit, { pluginsRegistry, pluginReducers } from './wrapperInit';
import type { ReducerConfig, ReducersMapObject, Store } from './store';
import type { ComponentType } from 'react';
import type { Plugin, PluginOpt } from './wrapperInit';

/*
    There are three routes:
        RedirectRouteItem
        NormalRouteItem
        ParentRedirectRoteItem
*/
// interface RouteItemBase {
//     path?: string;
//     casessensitive?: boolean;
//     children?: Array<RouteItem>;
//     lazy?: boolean;
//     title?: string;
// }
// export interface RedirectRouteItem extends RouteItemBase {
//     redirect: string;
// }
// export interface NormalRouteItem extends RouteItemBase {
//     component: ComponentType | (() => DynamicImportType);
// }
// export interface ParentRedirectRoteItem extends RouteItemBase {
//     redirect: string;
//     component: ComponentType | (() => DynamicImportType);
// }
export type DynamicImportType = Promise<{ default: ComponentType }>;

export interface RouteItem {
    path?: string;
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
    redirect?: string;
    component?: ComponentType | (() => DynamicImportType);
    // plugin route options
    [x: string]: unknown;
}

export interface ConstructorOptionsType {
    hash?: boolean;
    routes: Array<RouteItem>;
    reducerConfig?: ReducerConfig;
    reducers?: ReducersMapObject;
}

export default class {
    options: ConstructorOptionsType;

    constructor(params: ConstructorOptionsType) {
        this.options = params;
    }

    start(): void {
        const { hash, routes, reducerConfig, reducers } = this.options;
        // eslint-disable-next-line init-declarations
        let store: Store | null = null;

        if (reducerConfig || reducers || Object.keys(pluginReducers).length) {
            store = createStore({ ...reducerConfig, ...pluginReducers }, reducers);

            initialStore(store);
        }

        ReactDOM.render(
            <WrapperInit store={store} hash={hash} routes={routes} />,
            document.getElementById('root'),
        );
    }

    /* eslint-disable class-methods-use-this*/
    use(plugin: Plugin, opt?: PluginOpt): void {
        pluginsRegistry({
            plugin,
            opt,
        });
    }
    /* eslint-enable class-methods-use-this*/
}
