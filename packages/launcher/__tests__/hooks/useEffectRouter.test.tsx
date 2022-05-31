import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Launcher, { useRouter, useEffectRouter } from '../../src';

describe('useEffectRouter', () => {
    const Home = () => {
        const { redirectEffect, replaceEffect } = useEffectRouter();
        const { redirect } = useRouter();

        return (
            <div>
                <button
                    onClick={() => {
                        redirect('/', { name: 'root' });
                    }}
                >
                    redirect self
                </button>
                <button
                    onClick={() => {
                        redirectEffect({ index: 1 });
                    }}
                >
                    redirect effect self
                </button>
                <button
                    onClick={() => {
                        replaceEffect({ index: 11 });
                    }}
                >
                    replace relative path
                </button>
                home
            </div>
        );
    };
    const About = () => {
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

        it('should get truly path', () => {
            renderAndJump('redirect self');
            renderAndJump('redirect effect self');
            expect(window.location.search).toBe('?name=root&index=1');
        });

        it('should get truly path', () => {
            renderAndJump('redirect self');
            renderAndJump('replace relative path');
            expect(window.location.search).toBe('?name=root&index=11');
        });
    });
});
