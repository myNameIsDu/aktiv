import React, { Component, FC } from 'react';
import withRouter from '../../src/module/withRouter';
import Launcher from '../../src/module/app';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const spyPageRenderTime = jest.fn(() => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
const spyChildRenderTime = jest.fn(() => {});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DemoPage extends Component<any, any> {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        // eslint-disable-next-line prefer-rest-params,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        super(...Array.from(arguments));
    }

    handleClick = () => {
        // eslint-disable-next-line no-invalid-this
        this.props?.history.push('/child');
    };

    // eslint-disable-next-line class-methods-use-this
    render() {
        spyPageRenderTime();

        return (
            <>
                <h1>Test Router</h1>
                <button onClick={this.handleClick}>跳转</button>
            </>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const WithRouterPage = withRouter(DemoPage);

const ChildComponent: FC = () => {
    spyChildRenderTime();

    return <h1>child</h1>;
};

describe('withRouter', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    const homeRoute = {
        path: '/',
        component: WithRouterPage,
        // children: [
        //     {
        //         path: '/child',
        //         component: ChildComponent,
        //     },
        // ],
    };
    const app = new Launcher({
        hash: false,
        routes: [
            homeRoute,
            {
                path: '/child',
                component: ChildComponent,
            },
        ],
    });

    it('when render app, should can get router & query & match args', () => {
        act(() => {
            app.start();
        });
        expect(spyPageRenderTime).toHaveBeenCalledTimes(1);
        act(() => {
            userEvent.click(screen.getByText('跳转'));
        });
        expect(spyChildRenderTime).toHaveBeenCalledTimes(1);
    });
});
