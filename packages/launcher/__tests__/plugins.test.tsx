import Launcher, { Outlet, useNavigate } from '../src';
import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { ReactNode } from 'react';
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
describe('plugin', () => {
    describe('plugin with router', () => {
        it('should inner wrap the route', () => {
            /* eslint-disable */
            const spy = jest.fn(() => {});
            /* eslint-enable */

            const opt = {
                a: 1,
                b: 2,
            };
            const plugin = {
                name: 'testPlugin',
                inner: (children: ReactNode, receiveOpt: any) => {
                    expect(receiveOpt).toEqual(opt);
                    spy();

                    return (
                        <div>
                            innerRouter
                            <div>{children}</div>
                        </div>
                    );
                },
            };
            const Home = () => {
                const navigate = useNavigate();

                return (
                    <div>
                        <button
                            onClick={() => {
                                navigate('children');
                            }}
                        >
                            go children
                        </button>
                        home
                        <Outlet />
                    </div>
                );
            };
            const Children = () => {
                return <div>children</div>;
            };
            const app = new Launcher({
                hash: false,
                routes: [
                    {
                        path: '/',
                        component: Home,
                        children: [
                            {
                                path: 'children',
                                component: Children,
                            },
                        ],
                    },
                ],
            });

            app.use(plugin, opt);
            act(() => {
                app.start();
            });
            expect(document.body).toMatchSnapshot();
            act(() => {
                userEvent.click(screen.getByText('go children'));
            });
            expect(document.body).toMatchSnapshot();
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });
});
