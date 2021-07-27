import Launcher, { useNavigate, Outlet } from '../index';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

// eslint-disable-next-line init-declarations
let node: HTMLDivElement;

beforeEach(() => {
    node = document.createElement('div');

    node.id = 'root';
    node.setAttribute('data-testid', 'root');
    document.body.appendChild(node);
});

afterEach(() => {
    node.remove();
    window.history.pushState({}, '', '/');
});

describe('test router', () => {
    describe('test router redirect', () => {
        it('Redirect Route should redirect ', () => {
            function Home() {
                return <div>home</div>;
            }
            const app = new Launcher({
                routes: [
                    {
                        path: '/',
                        redirect: '/home',
                    },
                    {
                        path: '/home',
                        component: Home,
                    },
                ],
            });

            expect(location.pathname).toBe('/');
            act(() => {
                app.start();
            });
            expect(location.pathname).toBe('/home');
            expect(screen.getByTestId('root')).toContainHTML('<div>home</div>');
        });

        it('parent should redirect children', () => {
            function Root() {
                const navigate = useNavigate();
                const goHome = () => {
                    navigate('/home');
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

            const app = new Launcher({
                routes: [
                    {
                        path: '/',
                        component: Root,
                    },
                    {
                        path: '/home',
                        component: Home,
                        redirect: 'children-two',
                        children: [
                            {
                                path: '/children',
                                component: Children,
                            },
                            {
                                path: '/children-two',
                                component: ChildrenTwo,
                            },
                        ],
                    },
                ],
            });

            act(() => {
                app.start();
            });
            expect(location.pathname).toBe('/');
            act(() => {
                userEvent.click(screen.getByText('go home'));
            });
            expect(location.pathname).toBe('/home/children-two');
            expect(screen.getByTestId('root')).toContainHTML(
                '<div>home<div>childrenTwo</div></div>',
            );
        });
    });

    describe('test router config title', () => {
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

    describe('test router config lazy', () => {
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
