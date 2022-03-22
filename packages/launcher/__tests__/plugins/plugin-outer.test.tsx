import { ReactElement } from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Launcher, { Outlet, useNavigate } from '../../src';

describe('plugin outer with router', () => {
    it('should outer wrap router component and receive opt', () => {
        /* eslint-disable */
            const spyOuterCallTime = jest.fn(() => {});
            const spyOuterRenderTime = jest.fn(()=>{})
            /* eslint-enable */
        const opt = {
            a: 123,
            b: 345,
        };
        const OuterComponent = ({ children }: { children: ReactElement }) => {
            spyOuterRenderTime();

            return (
                <div>
                    outer Router
                    {children}
                </div>
            );
        };
        const plugin = {
            name: 'testPlugin',
            outer: (children: ReactElement, receiveOpt: any) => {
                expect(receiveOpt).toEqual(opt);
                spyOuterCallTime();

                return <OuterComponent>{children}</OuterComponent>;
            },
        };
        const Home = () => {
            const navigate = useNavigate();

            return (
                <div>
                    <button
                        onClick={() => {
                            navigate('/about');
                        }}
                    >
                        go about
                    </button>
                    home
                    <Outlet />
                </div>
            );
        };
        const About = () => {
            return <div>about</div>;
        };
        const homeRoute = {
            path: '/',
            component: Home,
        };
        const aboutRoute = {
            path: '/about',
            component: About,
        };
        const app = new Launcher({
            hash: false,
            routes: [homeRoute, aboutRoute],
        });

        app.use(plugin, opt);
        act(() => {
            app.start();
        });
        expect(document.body).toMatchSnapshot();
        expect(spyOuterCallTime).toHaveBeenCalledTimes(1);
        expect(spyOuterRenderTime).toHaveBeenCalledTimes(1);
        act(() => {
            userEvent.click(screen.getByText('go about'));
        });
        expect(document.body).toMatchSnapshot();
        expect(spyOuterCallTime).toHaveBeenCalledTimes(1);
        expect(spyOuterRenderTime).toHaveBeenCalledTimes(1);
    });
});
