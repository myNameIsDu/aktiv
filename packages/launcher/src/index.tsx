import ReactDOM from 'react-dom';
// import { hot } from 'react-hot-loader';
import { createStore, initialStore, createActions } from './store';
import WrapperInit, { pluginsRegistry, pluginReducers } from './wrapperInit';
import type { ReducerConfig, ReducersMapObject, Store } from './store';
import type { ComponentType } from 'react';
import type { Plugin, PluginOpt } from './wrapperInit';

export type DynamicImportType = Promise<{ default: ComponentType }>;
export { ReducerConfig, Plugin, PluginOpt };

// eslint-disable-next-line init-declarations
let store: Store;

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

export interface RouteItem {
    path?: string;
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
    redirect?: string;
    component?: ComponentType | (() => DynamicImportType);
    [x: string]: any;
}

interface ConstructorOptionsType {
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
export * from 'react-router-dom';
export * from 'react-router';
export * from 'react-redux';
export * from 'redux';
export * from 'immer';
export * from './hooks';
export { createActions };
