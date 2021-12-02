// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import type { FC } from 'react';
import withRouter from '../../src/module/withRouter';
import Launcher from '../../src/module/app';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// important: should import jest-dom to use expect dom method，eg: toHaveTextContent
import '@testing-library/jest-dom/extend-expect';

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

    handleQueryClick = () => {
        // eslint-disable-next-line no-invalid-this
        this.props?.history.push('/query-child?name="张三"');
    };

    // eslint-disable-next-line class-methods-use-this
    render() {
        spyPageRenderTime();

        return (
            <>
                <h1>Test Router</h1>
                <button onClick={this.handleClick}>跳转</button>
                <button onClick={this.handleQueryClick}>Query</button>
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

class RouterChildComponent extends Component<any, any> {
    constructor() {
        // eslint-disable-next-line prefer-rest-params,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        super(...Array.from(arguments));
    }

    render() {
        spyPageRenderTime();

        return (
            <>
                <h1>{this.props.query?.name || '测试'}</h1>
            </>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const WithRouertChild = withRouter(RouterChildComponent);

describe('withRouter', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    const homeRoute = {
        path: '/',
        component: WithRouterPage,
    };
    const app = new Launcher({
        hash: false,
        routes: [
            homeRoute,
            {
                path: '/child',
                component: ChildComponent,
            },
            {
                path: '/query-child',
                component: WithRouertChild,
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

    it('when render app, should can get query args', () => {
        act(() => {
            app.start();
        });
        act(() => {
            userEvent.click(screen.getByText('Query'));
        });

        expect(screen.getByRole('heading')).toHaveTextContent('张三');
    });
});
