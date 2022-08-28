import type { ComponentType } from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { enableES5 } from 'immer';
import LauncherProvider from './launcherProvider';
import WrapperInit, { pluginsRegistry, pluginReducers } from './wrapperInit';
import { createStore, initialStore } from '../store';
import type { ReducerConfig, ReducersMapObject, Store } from '../store';
import type { Plugin, PluginOpt } from './wrapperInit';
import type { RouteProps } from 'react-router-dom';
import type { Middleware } from 'redux';

export type DynamicImportType = Promise<{ default: ComponentType }>;

export interface RouteItem extends RouteProps {
    redirect?: string;
    component?: ComponentType | (() => DynamicImportType);
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
    // plugin route options
    [x: string]: unknown;
}

export interface ConstructorOptionsType {
    hash?: boolean;
    routes: Array<RouteItem>;
    reducerConfig?: ReducerConfig;
    reducers?: ReducersMapObject;
    immerEnableES5?: boolean;
    // When the formula is complete, go through the webpack configuration uniformly, and remove this method
    routerBasePath?: string;
    rootNode?: string;
    reduxMiddleware?: Middleware[];
    strictMode?: boolean;
}

class Launcher {
    options: ConstructorOptionsType;

    constructor(params: ConstructorOptionsType) {
        this.options = params;
    }

    start(): void {
        const {
            hash,
            routes,
            reducerConfig,
            reducers,
            immerEnableES5,
            routerBasePath,
            rootNode = '#root',
            reduxMiddleware,
            strictMode = false,
        } = this.options;
        // eslint-disable-next-line init-declarations
        let store: Store | null = null;

        if (reducerConfig || reducers || Object.keys(pluginReducers).length) {
            store = createStore({ ...reducerConfig, ...pluginReducers }, reducers, reduxMiddleware);
            if (immerEnableES5) {
                enableES5();
            }

            initialStore(store);
        }

        const baseApp = (
            <LauncherProvider
                value={{
                    basename: routerBasePath,
                }}
            >
                <WrapperInit store={store} hash={hash} routes={routes} />
            </LauncherProvider>
        );

        const App = strictMode ? <StrictMode>{baseApp}</StrictMode> : baseApp;

        ReactDOM.render(App, document.querySelector(rootNode));
    }

    use(plugin: Plugin, opt?: PluginOpt): void {
        pluginsRegistry({
            plugin,
            opt,
        });
    }
}

export default Launcher;
