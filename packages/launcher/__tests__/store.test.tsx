import React from 'react';
import { act } from '@testing-library/react';
import Launcher, { useSelector, createActions, useDispatch, isDraft } from '../src';
import type { ReducerConfig, AnyAction, Dispatch as ReduxDispatch } from '../src';

describe('store', () => {
    it('react-redux should not be rendered if reducer and reducerConfig are not passed in', () => {
        /* eslint-disable*/
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        /* eslint-enable */
        let errorMessage = '';

        type PropsType = unknown;
        type StateType = { hasError: boolean };
        const Home = () => {
            useSelector(state => state);

            return <div>home</div>;
        };

        class ErrorBoundary extends React.Component<PropsType, StateType> {
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
    describe('receive reducer and reducerConfig', () => {
        it('should initial state use reducerConfig and receive dispatch state', async () => {
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
            const state2Config = {
                editorState1B: {
                    key: 'b',
                    payload: (data: any) => data,
                    handle: (state: any, payload: any) => {
                        expect(isDraft(state)).toBe(true);
                        expect(payload).toBe('bbb');
                        state.b = payload;
                    },
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
            const reducerConfig: ReducerConfig = {
                state1: {
                    state: state1,
                    config: state1Config,
                },
                state2: {
                    state: state2,
                    config: state2Config,
                },
                state3: {
                    state: state3,
                    config: state3Config,
                },
            };
            // eslint-disable-next-line init-declarations
            let dispatch: (s: any) => void;

            let shouldState: any = null;
            const Home = () => {
                useSelector(state => {
                    shouldState = state;

                    return state;
                });
                dispatch = useDispatch();

                return <div>home</div>;
            };

            const app = new Launcher({
                routes: [
                    {
                        path: '/',
                        component: Home,
                    },
                ],
                reducerConfig,
            });

            act(() => {
                app.start();
            });

            const initialState = { state1, state2, state3 };

            expect(shouldState).toEqual(initialState);
            // normal
            const state1Actions = createActions(state1Config);

            const resultA = state1Actions.editorState1A('aaa');

            expect(resultA).toBe('aaa');
            expect(shouldState).toEqual({ ...initialState, state1: { a: 'aaa' } });
            // has handle
            const state2Actions = createActions(state2Config);

            const resultB = state2Actions.editorState1B('bbb');

            expect(resultB).toBe('bbb');
            expect(shouldState).toEqual({ state2: { b: 'bbb' }, state1: { a: 'aaa' }, state3 });

            // promise
            const state3Actions = createActions(state3Config);
            // promise resolve
            const resultCPromiseResolve = await state3Actions.editorState3CPromiseResolve();

            expect(resultCPromiseResolve).toBe('promise-resolve-payload');
            expect(shouldState).toEqual({
                state2: { b: 'bbb' },
                state1: { a: 'aaa' },
                state3: { c: 'promise-resolve-payload' },
            });
            // promise reject
            const resultCPromiseReject = await state3Actions
                .editorState3CPromiseReject()
                .catch((error: any) => error);

            expect(resultCPromiseReject).toBe('promise-reject-payload');
            expect(shouldState).toEqual({
                state2: { b: 'bbb' },
                state1: { a: 'aaa' },
                state3: { c: 'promise-reject-payload' },
            });

            // test thunk
            act(() => {
                dispatch((d: ReduxDispatch) => {
                    d({ type: 'editorState1A', payload: 'thunk-a', stateKey: 'a' });
                });
            });
            expect(shouldState).toEqual({
                state2: { b: 'bbb' },
                state1: { a: 'thunk-a' },
                state3: { c: 'promise-reject-payload' },
            });
        });

        it('should initial state use reducer and dispatch state', () => {
            const reducerConfig: ReducerConfig = {
                state1: {
                    state: {
                        a: '123',
                    },
                    config: {},
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
            let shouldState: any = null;
            // eslint-disable-next-line init-declarations
            let disPatch: ReduxDispatch;
            const Home = () => {
                disPatch = useDispatch();
                useSelector(state => {
                    shouldState = state;

                    return state;
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
                reducers,
                reducerConfig,
            });

            act(() => {
                app.start();
            });
            expect(shouldState).toEqual({ list: 'reducer-list', state1: { a: '123' } });
            disPatch!({ type: 'reducer-list-action' });
            expect(shouldState).toEqual({ list: 'dispatch-reducer-list', state1: { a: '123' } });
        });
    });
});
