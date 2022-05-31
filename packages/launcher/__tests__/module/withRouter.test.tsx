// eslint-disable-next-line max-classes-per-file
import { Component, useRef, type FC } from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Launcher from '../../src/module/app';
import withRouter, { type HocExtraProps } from '../../src/module/withRouter';
import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const spyPageRenderTime = jest.fn(() => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
const spyChildRenderTime = jest.fn(() => {});

interface DemoPagePropsType {
    a: string;
}
class DemoPage extends Component<DemoPagePropsType & HocExtraProps, unknown> {
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
const WithRouterPage = withRouter<DemoPagePropsType, DemoPage>(DemoPage);

function RoteCom() {
    const DemoRef = useRef<DemoPage>(null);

    // 查看类型是否复合预期
    // eslint-disable-next-line no-console
    console.log(DemoRef.current?.handleClick);

    return <WithRouterPage ref={DemoRef} a="123" />;
}

const ChildComponent: FC = () => {
    spyChildRenderTime();

    return <h1>child</h1>;
};

class QueryClassicComponent extends Component<any, any> {
    render() {
        return <h1>{this.props.query?.name || '测试'}</h1>;
    }
}

const WithQueryComponent = withRouter(QueryClassicComponent);

describe('withRouter', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    const app = new Launcher({
        hash: false,
        routes: [
            {
                path: '/',
                component: RoteCom,
            },
            {
                path: '/child',
                component: ChildComponent,
            },
            {
                path: '/query-child',
                component: WithQueryComponent,
            },
        ],
    });

    it('when render app, should can get router & query & match args', () => {
        act(() => {
            app.start();
        });
        expect(spyPageRenderTime).toHaveBeenCalledTimes(1);
        userEvent.click(screen.getByText('跳转'));
        expect(spyChildRenderTime).toHaveBeenCalledTimes(1);
    });
});
