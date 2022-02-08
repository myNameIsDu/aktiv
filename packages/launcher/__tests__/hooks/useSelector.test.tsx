import Launcher from '../../src';
import { useAktivSelector } from '../../src/hooks';
import { act, screen } from '@testing-library/react';

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
});
