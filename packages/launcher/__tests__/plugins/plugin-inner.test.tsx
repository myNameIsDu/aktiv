import { ReactElement } from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Launcher, { Outlet, useNavigate } from '../../src';
import type { RouteItem } from '../../src';

describe('plugin inner with router', () => {
    it('should inner wrap the route component and receive opt and route', () => {
        /* eslint-disable */
        const spyInnerCallTime = jest.fn(() => {});
        const spyInnerRenderTime = jest.fn(() => {});
        const spyHomeRenderTime = jest.fn(()=>{})
        /* eslint-enable */

        const opt = {
            a: 1,
            b: 2,
        };
        const routeList: RouteItem[] = [];

        const InnerComponent = ({ children }: { children: ReactElement }) => {
            spyInnerRenderTime();

            return (
                <div>
                    innerRouter
                    <div>{children}</div>
                </div>
            );
        };

        const plugin = {
            name: 'testPlugin',
            inner: (children: ReactElement, route: RouteItem, receiveOpt: any) => {
                expect(receiveOpt).toEqual(opt);
                spyInnerCallTime();
                routeList.push(route as RouteItem);

                return <InnerComponent>{children}</InnerComponent>;
            },
        };
        const Home = () => {
            const navigate = useNavigate();

            spyHomeRenderTime();

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
        const childrenRoute = {
            path: 'children',
            component: Children,
        };
        const homeRoute = {
            path: '/',
            component: Home,
            children: [childrenRoute],
        };
        const app = new Launcher({
            hash: false,
            routes: [homeRoute],
        });

        app.use(plugin, opt);
        act(() => {
            app.start();
        });
        expect(document.body).toMatchSnapshot();
        expect(spyInnerRenderTime).toHaveBeenCalledTimes(1);
        expect(spyHomeRenderTime).toHaveBeenCalledTimes(1);
        userEvent.click(screen.getByText('go children'));
        expect(document.body).toMatchSnapshot();
        expect(spyInnerCallTime).toHaveBeenCalledTimes(2);
        // Note: Since react-router is written with children, routeComponent does not render when the router changes
        expect(spyInnerRenderTime).toHaveBeenCalledTimes(2);
        /*
                Note: Since home uses useNative, it will render again when the router changes
                But with this PR merge, subscriptions to useNative will not trigger a re-render
                https://github.com/ReactTraining/react-router/pull/7910
            */
        expect(spyHomeRenderTime).toHaveBeenCalledTimes(2);
        expect(routeList).toEqual([homeRoute, childrenRoute]);
    });
});
