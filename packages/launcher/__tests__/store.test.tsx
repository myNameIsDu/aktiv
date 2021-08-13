import React from 'react';
import { act, screen } from '@testing-library/react';
import Launcher, { useSelector, createActions, useDispatch, isDraft } from '../src';
import type {
    ReducerConfig,
    AnyAction,
    Dispatch as ReduxDispatch,
    ReducersMapObject,
} from '../src';

describe('store', () => {
    it('react-redux should not be rendered if reducer and reducerConfig are not passed in', () => {
        /* eslint-disable*/
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        /* eslint-enable */
        let errorMessage = '';

        type PropsType = unknown;
        type ErrorBoundaryStateType = { hasError: boolean };
        const Home = () => {
            useSelector(state => state);

            return <div>home</div>;
        };

        class ErrorBoundary extends React.Component<PropsType, ErrorBoundaryStateType> {
            constructor(props: PropsType) {
                super(props);
                this.state = {
                    hasError: false,
                };
            }

            static getDerivedStateFromError(error: any) {
                errorMessage = error.message;

                return { hasError: true };
            }

            render() {
                return this.state.hasError ? null : <Home />;
            }
        }

        const app = new Launcher({
            routes: [
                {
                    path: '/',
                    component: ErrorBoundary,
                },
            ],
        });

        app.start();
        expect(errorMessage).toMatch(
            'could not find react-redux context value; please ensure the component is wrapped in a <Provider>',
        );
    });

    describe('initialize state, use dispatch, and custom handle state', () => {
        const state1 = {
            a: 'hello',
        };
        const state2 = {
            b: 'hi',
        };
        const state3 = {
            c: 'ccc',
        };

        const state1Config = {
            editorState1A: {
                key: 'a',
                payload: (data: any) => data,
            },
        };

        const state3Config = {
            editorState3CPromiseResolve: {
                key: 'c',
                payload: () => {
                    return new Promise(res => {
                        res('promise-resolve-payload');
                    });
                },
            },
            editorState3CPromiseReject: {
                key: 'c',
                payload: () => {
                    return new Promise((res, rej) => {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        rej('promise-reject-payload');
                    });
                },
            },
        };

        const reducers = {
            // eslint-disable-next-line default-param-last
            list: (state = 'reducer-list', action: AnyAction) => {
                if (action.type === 'reducer-list-action') {
                    return 'dispatch-reducer-list';
                }

                return state;
            },
        };
        const startRender = (
            reducerConfig: ReducerConfig,
            customReducers?: ReducersMapObject,
        ): ((s: any) => void) => {
            // eslint-disable-next-line init-declarations
            let dispatch: (s: any) => void;

            const Home = () => {
                const shouldState = useSelector(state => state);

                dispatch = useDispatch();

                return (
                    <div>
                        <div>home</div>
                        <div data-testid="state">{JSON.stringify(shouldState)}</div>
                    </div>
                );
            };

            const app = new Launcher({
                routes: [
                    {
                        path: '/',
                        component: Home,
                    },
                ],
                reducerConfig,
                reducers: customReducers,
            });

            act(() => {
                app.start();
            });

            // @ts-ignore Expected newline before return statement
            return dispatch;
        };

        const selectState = () => {
            return JSON.parse(screen.getByTestId('state').innerHTML);
        };

        describe('receive reducers reducerConfig and initial state', () => {
            it('should initial state use reducerConfig', () => {
                startRender({
                    state1: {
                        state: state1,
                        config: {},
                    },
                    state2: {
                        state: state2,
                        config: {},
                    },
                });
                expect(selectState()).toEqual({ state1, state2 });
            });
            it('should initial state use reducers', () => {
                startRender({}, reducers);
                expect(selectState()).toEqual({
                    list: 'reducer-list',
                });
            });
            it('should initial state use reducers and reducerConfig', () => {
                startRender(
                    {
                        state1: {
                            state: state1,
                            config: {},
                        },
                        state2: {
                            state: state2,
                            config: {},
                        },
                    },
                    reducers,
                );
                expect(selectState()).toEqual({
                    state1,
                    state2,
                    list: 'reducer-list',
                });
            });
        });
        describe('use dispatch', () => {
            it('should set state key and return payload, when payload is normal data', () => {
                startRender({
                    state1: {
                        state: state1,
                        config: state1Config,
                    },
                    state2: {
                        state: state2,
                        config: {},
                    },
                });
                const newState = 1;
                const state1Actions = createActions(state1Config);
                const dispatchResult = state1Actions.editorState1A(newState);

                expect(dispatchResult).toBe(newState);
                expect(selectState()).toEqual({ state1: { a: newState }, state2 });
            });
            it('should set state key and return payload, when payload is promise resolve', async () => {
                startRender({
                    state1: {
                        state: state1,
                        config: state1Config,
                    },
                    state3: {
                        state: state3,
                        config: state3Config,
                    },
                });
                const state3Actions = createActions(state3Config);
                const dispatchResult = await state3Actions.editorState3CPromiseResolve();

                expect(dispatchResult).toBe('promise-resolve-payload');
                expect(selectState()).toEqual({ state1, state3: { c: 'promise-resolve-payload' } });
            });

            it('should set state key and return payload, when payload is promise reject', async () => {
                startRender({
                    state1: {
                        state: state1,
                        config: state1Config,
                    },
                    state3: {
                        state: state3,
                        config: state3Config,
                    },
                });
                const state3Actions = createActions(state3Config);
                const dispatchResult = await (
                    state3Actions.editorState3CPromiseReject() as Promise<unknown>
                ).catch(e => e);

                expect(dispatchResult).toBe('promise-reject-payload');
                expect(selectState()).toEqual({ state1, state3: { c: 'promise-reject-payload' } });
            });

            it('should set state key, when use custom dispatch and function action', () => {
                const dispatch = startRender({
                    state1: {
                        state: state1,
                        config: state1Config,
                    },
                });

                // test thunk middle
                act(() => {
                    dispatch((d: ReduxDispatch) => {
                        d({ type: 'editorState1A', payload: 'thunk-a', stateKey: 'a' });
                    });
                });

                expect(selectState()).toEqual({ state1: { a: 'thunk-a' } });
            });

            it('should set state key, when use custom dispatch and reducers', () => {
                const dispatch = startRender({}, reducers);

                expect(selectState()).toEqual({
                    list: 'reducer-list',
                });
                dispatch({ type: 'reducer-list-action' });

                expect(selectState()).toEqual({ list: 'dispatch-reducer-list' });
            });
        });

        describe('use custom handle state', () => {
            it('should set state and handle should receive draft and payload, when use custom handle state', () => {
                const newState = 'bbb';
                const state2Config = {
                    editorState1B: {
                        key: 'b',
                        payload: (data: unknown) => data,
                        handle: (state: Record<string, unknown>, payload: unknown) => {
                            expect(isDraft(state)).toBe(true);
                            expect(payload).toBe(newState);
                            state.b = payload;
                        },
                    },
                };

                startRender({
                    state2: {
                        state: state2,
                        config: state2Config,
                    },
                });
                const state2Actions = createActions(state2Config);

                const result = state2Actions.editorState1B(newState);

                expect(result).toBe(newState);
            });
        });
    });

    it('should call custom redux middleware, when pass reduxMiddleware', () => {
        const Home = () => {
            return <div>home</div>;
        };

        // eslint-disable-next-line init-declarations
        let receiveAction: AnyAction;
        const customMiddleware = () => (next: ReduxDispatch) => (action: AnyAction) => {
            receiveAction = action;
            next(action);
        };
        const actionConfig = {
            editorA: {
                key: 'a',
                payload: (data: unknown) => data,
            },
        };
        const reducerConfig = {
            state1: {
                state: {
                    a: 'a',
                },
                config: actionConfig,
            },
        };

        const app = new Launcher({
            routes: [
                {
                    path: '/',
                    component: Home,
                },
            ],
            reducerConfig,
            reduxMiddleware: [customMiddleware],
        });

        act(() => {
            app.start();
        });
        const actions = createActions(actionConfig);

        const newState = 1;

        actions.editorA(newState);
        // @ts-ignore  before initial
        expect(receiveAction).toMatchObject({ type: 'editorA', stateKey: 'a', payload: newState });
    });
});
