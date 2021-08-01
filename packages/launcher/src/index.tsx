import ReactDOM from 'react-dom';
// import { hot } from 'react-hot-loader';
import WrapperInit, { pluginsRegistry } from './wrapperInit';
import type { ComponentType } from 'react';
import type { Plugin, PluginOpt } from './wrapperInit';
export * from 'react-router-dom';
export * from './hooks';

export type DynamicImportType = Promise<{ default: ComponentType }>;

interface RouteItemBase {
    path?: string;
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
}
export interface RedirectRouteItem extends RouteItemBase {
    redirect: string;
}
export interface NormalRouteItem extends RouteItemBase {
    component: ComponentType | (() => DynamicImportType);
}
export interface ParentRedirectRoteItem extends RouteItemBase {
    redirect: string;
    component: ComponentType | (() => DynamicImportType);
}

export interface RouteItem {
    path?: string;
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
    title?: string;
    redirect?: string;
    component?: ComponentType | (() => DynamicImportType);
}

interface ConstructorOptionsType {
    hash?: boolean;
    routes: Array<RouteItem>;
}

export default class {
    options: ConstructorOptionsType;

    constructor(params: ConstructorOptionsType) {
        this.options = params;
    }

    start(): void {
        const { hash, routes } = this.options;

        ReactDOM.render(
            <WrapperInit hash={hash} routes={routes} />,
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
