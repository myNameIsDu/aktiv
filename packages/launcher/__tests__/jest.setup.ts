import '@testing-library/jest-dom/extend-expect';

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
