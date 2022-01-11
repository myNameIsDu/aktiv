import Launcher, { useSelector, createActions } from '../../src';
import type { ReactElement } from 'react';
import { act } from '@testing-library/react';

describe('plugin store', () => {
    let shouldState: unknown = null;

    afterEach(() => {
        shouldState = null;
    });
    const createApp = () => {
        const Home = () => {
            useSelector(s => {
                shouldState = s;

                return s;
            });

            return <div>home</div>;
        };
        const app = new Launcher({
            routes: [
                {
                    path: '/',
                    component: Home,
                },
            ],
        });

        return app;
    };

    interface InnerComponentPropsType {
        children: ReactElement;
    }
    const InnerComponent = ({ children }: InnerComponentPropsType) => {
        return <div>{children}</div>;
    };
    const actionConfig = {
        editorPluginAction: {
            key: 'a',
            payload: (s: any) => s,
        },
    };
    const pluginReducer = {
        state: {
            a: 'a',
        },
        config: actionConfig,
    };
    const plugin = {
        name: 'testPlugin',
        inner: (children: ReactElement) => {
            return <InnerComponent>{children}</InnerComponent>;
        },
        reducerConfig: pluginReducer,
    };

    it('show use store when plugin have reducer', () => {
        const app = createApp();

        app.use(plugin);
        act(() => {
            app.start();
        });
        expect(shouldState).toEqual({ testPlugin: { a: 'a' } });
        const pluginActions = createActions(actionConfig);

        pluginActions.editorPluginAction('hello');
        expect(shouldState).toEqual({ testPlugin: { a: 'hello' } });
    });

    it("show use store when plugin have opt's reducer", () => {
        const app = createApp();

        act(() => {
            app.start();
        });
        expect(shouldState).toEqual({ testPlugin: { a: 'a' } });
        const pluginActions = createActions(actionConfig);

        pluginActions.editorPluginAction('hello');
        expect(shouldState).toEqual({ testPlugin: { a: 'hello' } });
    });
});
