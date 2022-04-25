import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Launcher, { useRouter, useQuery } from '../../src';

describe('useQuery', () => {
    const Home = () => {
        const { redirect } = useRouter();
        const query = useQuery();

        return (
            <div>
                <button
                    onClick={() => {
                        redirect('/', { name: 'root' });
                    }}
                >
                    redirect self
                </button>
                <span>{query?.name}</span>
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

            act(() => {
                userEvent.click(screen.getByText(s));
            });
        };

        it('should get truly query', () => {
            renderAndJump('redirect self');

            expect(screen.findByText('root')).toBeTruthy();
        });
    });
});
