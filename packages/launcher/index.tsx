import ReactDOM from 'react-dom';
import type { ComponentType } from 'react';
import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';
import renderRoutes from './render-routers';
// [
//     {
//         path:'',
//         component:'',
//         casessensitive:'',
//         children:[

//         ]
//     }
// ]
export interface RouteItem {
    path?: string;
    component: ComponentType | (() => Promise<ComponentType>);
    casessensitive?: boolean;
    children?: Array<RouteItem>;
    lazy?: boolean;
}
interface OptionsType {
    hash?: boolean;
    routes: Array<RouteItem>;
}

export default class {
    readonly options;

    constructor(params: OptionsType) {
        this.options = params;
    }

    start(): void {
        const { hash, routes } = this.options;
        const Router = hash ? HashRouter : BrowserRouter;

        ReactDOM.render(
            <Router>
                <Routes>{renderRoutes(routes)}</Routes>
            </Router>,
            document.getElementById('root'),
        );
    }
}