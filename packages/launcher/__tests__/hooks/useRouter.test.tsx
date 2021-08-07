import Launcher, { useRouter, useLocation } from '../../src';
import type { Location } from 'history';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('userRouter', () => {
    const state = { a: 1 };

    // eslint-disable-next-line init-declarations
    let routerLocation: Location;
    const Home = () => {
        routerLocation = useLocation();
        const { redirect, replace } = useRouter();

        return (
            <div>
                <button
                    onClick={() => {
                        redirect('/about', state);
                    }}
                >
                    redirect
                </button>
                <button
                    onClick={() => {
                        replace('/about', state);
                    }}
                >
                    replace
                </button>
                home
            </div>
        );
    };
    const About = () => {
        routerLocation = useLocation();

        return <div>about</div>;
    };

    it('should use push state', () => {
        const app = new Launcher({
            routes: [
                {
                    path: '/',
                    component: Home,
                },
                {
                    path: '/about',
                    component: About,
                },
            ],
        });

        act(() => {
            app.start();
        });
        const beforeLength = window.history.length;

        act(() => {
            userEvent.click(screen.getByText('redirect'));
        });
        expect(routerLocation.state).toEqual(state);
        expect(window.history.length).toBe(beforeLength + 1);
    });

    it('should use replace state', () => {
        const app = new Launcher({
            routes: [
                {
                    path: '/',
                    component: Home,
                },
                {
                    path: '/about',
                    component: About,
                },
            ],
        });

        act(() => {
            app.start();
        });
        const beforeLength = window.history.length;

        act(() => {
            userEvent.click(screen.getByText('replace'));
        });
        expect(routerLocation.state).toEqual(state);
        expect(window.history.length).toBe(beforeLength);
    });
});
