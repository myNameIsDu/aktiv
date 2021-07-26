import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';
import renderRoutes from './router/render-routers';
// import { hot } from 'react-hot-loader';
import type { ComponentType } from 'react';

export * from 'react-router-dom';
export * from './hooks';
export { renderRoutes };

export interface RouteComponentPropsType {
    routes?: Array<RouteItem>;
}
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

interface OptionsType {
    hash?: boolean;
    routes: Array<RouteItem>;
}

export default class {
    options: OptionsType;

    constructor(params: OptionsType) {
        this.options = params;
    }

    start(): void {
        const { hash, routes } = this.options;
        const Router = hash ? HashRouter : BrowserRouter;
        const APP = () => (
            <Router>
                <Routes>{renderRoutes(routes)}</Routes>
            </Router>
        );

        ReactDOM.render(<APP />, document.getElementById('root'));
    }
}
