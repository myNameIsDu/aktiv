import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';
import renderRoutes from './render-routers';
// import { hot } from 'react-hot-loader';
import type { ComponentType } from 'react';

export * from 'react-router-dom';
export { renderRoutes };

export interface RouteComponentPropsType {
    routes?: Array<RouteItem>;
}
export type RouteComponentType = ComponentType;
export type DynamicImportType = Promise<{ default: RouteComponentType }>;
export interface RouteItem {
    path?: string;
    component: RouteComponentType | (() => DynamicImportType);
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
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
