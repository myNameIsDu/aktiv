import Launcher, { Outlet, useRouter } from '../../src';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RouteItem } from '../../src';
import '@testing-library/jest-dom';

describe('router', () => {
    describe('routeItem has redirect', () => {
        function Root() {
            const { redirect } = useRouter();
            const goHome = () => {
                redirect('/home');
            };

            return <button onClick={goHome}>go home</button>;
        }
        function Home() {
            return (
                <div>
                    home
                    <Outlet />
                </div>
            );
        }
        function Children() {
            return <div>children</div>;
        }
        function ChildrenTwo() {
            return <div>childrenTwo</div>;
        }
        const startMethod = (routes: RouteItem[], basePath?: string) => {
            const app = new Launcher({
                routes,
                routerBasePath: basePath,
            });

            act(() => {
                app.start();
            });
        };

        const redirectItem = (isAbsolute: boolean) => {
            return [
                {
                    path: '/',
                    redirect: isAbsolute ? '/home' : 'home',
                },
                {
                    path: '/home',
                    component: Home,
                },
            ];
        };
        const parentRedirectItem = (isAbsolute: boolean) => {
            return [
                {
                    path: '/',
                    component: Root,
                },
                {
                    path: '/home',
                    component: Home,
                    redirect: isAbsolute ? '/home/children-two' : 'children-two',
                    children: [
                        {
                            path: '/home/children',
                            component: Children,
                        },
                        {
                            path: '/home/children-two',
                            component: ChildrenTwo,
                        },
                    ],
                },
            ];
        };

        describe('launcher options no basePath', () => {
            describe('use relative redirect path', () => {
                it('should redirect to /home, when start', () => {
                    startMethod(redirectItem(false));

                    expect(window.location.pathname).toBe('/home');
                    expect(screen.getByTestId('root')).toContainHTML('<div>home</div>');
                });

                it('should redirect to /home/children, when jump to /home', () => {
                    startMethod(parentRedirectItem(false));
                    act(() => {
                        userEvent.click(screen.getByText('go home'));
                    });
                    expect(window.location.pathname).toBe('/home/children-two');
                    expect(screen.getByTestId('root')).toContainHTML(
                        '<div>home<div>childrenTwo</div></div>',
                    );
                });
            });

            describe('use absolute redirect path', () => {
                it('should redirect to /home, when start', () => {
                    startMethod(redirectItem(true));

                    expect(window.location.pathname).toBe('/home');
                    expect(screen.getByTestId('root')).toContainHTML('<div>home</div>');
                });

                it('should redirect to /home/children, when jump to /home', () => {
                    startMethod(parentRedirectItem(true));
                    act(() => {
                        userEvent.click(screen.getByText('go home'));
                    });
                    expect(window.location.pathname).toBe('/home/children-two');
                    expect(screen.getByTestId('root')).toContainHTML(
                        '<div>home<div>childrenTwo</div></div>',
                    );
                });
            });
        });

        describe('launcher has basePath', () => {
            const basePath = '/hello';

            describe('normal start', () => {
                it('Should render empty, when normally start', () => {
                    startMethod(parentRedirectItem(true), basePath);
                    expect(document.body.innerHTML).toBe(
                        '<div id="root" data-testid="root"></div>',
                    );
                });
            });
            describe('push basePah then start', () => {
                beforeEach(() => {
                    window.history.pushState({}, '', '/hello');
                });
                describe('use relative redirect path', () => {
                    it('should redirect to /hello/home, when start', () => {
                        startMethod(redirectItem(false), basePath);

                        expect(window.location.pathname).toBe('/hello/home');
                        expect(screen.getByTestId('root')).toContainHTML('<div>home</div>');
                    });

                    it('should redirect to /hello/home/children, when jump to /hello/home', () => {
                        startMethod(parentRedirectItem(false), basePath);
                        act(() => {
                            userEvent.click(screen.getByText('go home'));
                        });

                        expect(window.location.pathname).toBe('/hello/home/children-two');
                        expect(screen.getByTestId('root')).toContainHTML(
                            '<div>home<div>childrenTwo</div></div>',
                        );
                    });
                });
                describe('use absolute redirect path', () => {
                    it('should redirect to /hello/home, when start', () => {
                        startMethod(redirectItem(true), basePath);

                        expect(window.location.pathname).toBe('/hello/home');
                        expect(screen.getByTestId('root')).toContainHTML('<div>home</div>');
                    });

                    it('should redirect to /hello/home/children, when jump to /hello/home', () => {
                        startMethod(parentRedirectItem(true), basePath);
                        act(() => {
                            userEvent.click(screen.getByText('go home'));
                        });

                        expect(window.location.pathname).toBe('/hello/home/children-two');
                        expect(screen.getByTestId('root')).toContainHTML(
                            '<div>home<div>childrenTwo</div></div>',
                        );
                    });
                });
            });
        });
    });

    describe('routerItem has title', () => {
        it('should assign document.title', () => {
            const Home = () => {
                return <div>home</div>;
            };
            const app = new Launcher({
                routes: [
                    {
                        path: '/',
                        component: Home,
                        title: 'home',
                    },
                ],
            });

            act(() => {
                app.start();
            });
            expect(document.title).toBe('home');
        });
    });

    describe('routerItem has lazy', () => {
        function waitFor(delay: number) {
            return new Promise(resolve => {
                setTimeout(resolve, delay);
            });
        }
        it('should loading and load component', async () => {
            function Home() {
                return <div>home</div>;
            }
            const homeLazy = () => {
                return waitFor(4000).then(() => {
                    return { default: Home, __esModule: true };
                });
            };
            const app = new Launcher({
                routes: [
                    {
                        path: '/',
                        component: homeLazy,
                        title: 'home',
                        lazy: true,
                    },
                ],
            });

            act(() => {
                app.start();
            });

            expect(document.body).toMatchSnapshot();
            await waitFor(4000);
            expect(document.body).toMatchSnapshot();
        });
    });
});
