import React from 'react';
import { act, screen } from '@testing-library/react';
import Launcher from '../../src';
import { useAktivSelector } from '../../src/hooks';

describe('useSelector', () => {
    it('when use aktivSelector, should return truly result', () => {
        const Home = () => {
            const state = useAktivSelector<string>('state1.a');

            return (
                <div>
                    <div>home</div>
                    <span data-testid="custom-element">{state}</span>
                </div>
            );
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
        });

        act(() => {
            app.start();
        });

        expect(screen.getByTestId('custom-element').innerHTML).toEqual('a');
    });

    it('when use aktivSelector, path is one level, should return truly result', () => {
        const Home = () => {
            const state = useAktivSelector<{ a: string }>('state1');

            return (
                <div>
                    <div>home</div>
                    <span data-testid="custom-element">{state.a}</span>
                </div>
            );
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
        });

        act(() => {
            app.start();
        });

        expect(screen.getByTestId('custom-element').innerHTML).toEqual('a');
    });

    it('when use aktivSelector, selector is function, should return truly result', () => {
        const Home = () => {
            const state = useAktivSelector<{ state1: { a: string } }>(s => s);

            return (
                <div>
                    <div>home</div>
                    <span data-testid="custom-element">{state.state1.a}</span>
                </div>
            );
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
        });

        act(() => {
            app.start();
        });

        expect(screen.getByTestId('custom-element').innerHTML).toEqual('a');
    });
});
