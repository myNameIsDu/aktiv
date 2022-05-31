import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Launcher, { useRouter, useLocation } from '../../src';
import type { Location } from 'react-router-dom';

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
                        redirect('about');
                    }}
                >
                    redirect relative path
                </button>
                <button
                    onClick={() => {
                        redirect('/about');
                    }}
                >
                    redirect absolute path
                </button>
                <button
                    onClick={() => {
                        redirect('/about', {}, state);
                    }}
                >
                    redirect has params
                </button>
                <button
                    onClick={() => {
                        replace('about');
                    }}
                >
                    replace relative path
                </button>
                <button
                    onClick={() => {
                        replace('/about');
                    }}
                >
                    replace absolute path
                </button>
                <button
                    onClick={() => {
                        replace('/about', {}, state);
                    }}
                >
                    replace has params
                </button>
                home
            </div>
        );
    };
    const About = () => {
        routerLocation = useLocation();

        return <div>about</div>;
    };

    describe('there is no basePath', () => {
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
        const renderAndJump = (s: string) => {
            act(() => {
                app.start();
            });

            userEvent.click(screen.getByText(s));
        };

        describe('use userRouter => redirect and there is no basePath', () => {
            it('should jump /about and history.length should added by one, when use absolute path', () => {
                const beforeLength = window.history.length;

                renderAndJump('redirect absolute path');
                expect(window.location.pathname).toBe('/about');
                expect(window.history.length).toBe(beforeLength + 1);
            });
            it('should jump /about and history.length should added by one, when use relative path', () => {
                const beforeLength = window.history.length;

                renderAndJump('redirect relative path');
                expect(window.location.pathname).toBe('/about');
                expect(window.history.length).toBe(beforeLength + 1);
            });

            it('should push state, when redirect have second params', () => {
                renderAndJump('redirect has params');
                expect(routerLocation.state).toEqual(state);
            });
        });

        describe('use userRouter => replace and there is no basePath', () => {
            it('should jump /about andy history.length should not be added by one, when use absolute path', () => {
                const beforeLength = window.history.length;

                renderAndJump('replace absolute path');
                expect(window.location.pathname).toBe('/about');
                expect(window.history.length).toBe(beforeLength);
            });
            it('should jump /about and history.length should not be added by one, when use relative path', () => {
                const beforeLength = window.history.length;

                renderAndJump('replace relative path');
                expect(window.location.pathname).toBe('/about');
                expect(window.history.length).toBe(beforeLength);
            });

            it('should push state, when redirect have second params', () => {
                renderAndJump('replace has params');
                expect(routerLocation.state).toEqual(state);
            });
        });
    });

    describe('use userRouter => redirect and has basePath', () => {
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
            routerBasePath: '/hello',
        });
        const renderAndJump = (s: string) => {
            window.history.pushState({}, '', '/hello');
            act(() => {
                app.start();
            });

            userEvent.click(screen.getByText(s));
        };

        it('show jump /hello/about, when use redirect relative path', () => {
            renderAndJump('redirect relative path');
            expect(window.location.pathname).toBe('/hello/about');
        });

        it('show jump /hello/about, when use redirect absolute path', () => {
            renderAndJump('redirect absolute path');
            expect(window.location.pathname).toBe('/hello/about');
        });
        it('show jump /hello/about, when use replace relative path', () => {
            renderAndJump('replace relative path');
            expect(window.location.pathname).toBe('/hello/about');
        });

        it('show jump /hello/about, when use replace absolute path', () => {
            renderAndJump('replace absolute path');
            expect(window.location.pathname).toBe('/hello/about');
        });
    });
});
