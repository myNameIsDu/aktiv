import { produce } from 'immer';
import { createStore as reduxCreateStore, compose, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from './promiseMiddleware';
import type { Store, ReducersMapObject, AnyAction, Middleware } from 'redux';

export type { ReducersMapObject, Store };
// eslint-disable-next-line init-declarations
let store: Store;

export const initialStore = (s: Store): void => {
    store = s;
};

type WritableDraft<T> = {
    -readonly [K in keyof T]: T[K];
};
export type StateType = Readonly<Record<string, unknown>>;

export type PayloadType = unknown;

export type ActionItem = {
    key: string;
    payload: (...arg: any[]) => any;
    handle?: (s: StateType, p: PayloadType) => unknown;
};
export type ActionsConfig = Record<string, ActionItem>;

export type ResultActionTypes<T extends ActionsConfig> = {
    [P in keyof T]: T[P]['payload'];
};

export type ReducerConfigItem = {
    state: StateType;
    config: ActionsConfig;
};

export type ReducerConfig = Record<string, ReducerConfigItem>;

interface HandleType {
    (s: StateType, a: AnyAction): unknown;
}
type HandlesType = Record<string, HandleType>;

export const createActions = <T extends ActionsConfig>(actionsConfig: T) => {
    const result: ResultActionTypes<T> = {} as ResultActionTypes<T>;

    for (const key in actionsConfig) {
        if (Object.prototype.hasOwnProperty.call(actionsConfig, key)) {
            const element = actionsConfig[key];

            // eslint-disable-next-line no-loop-func
            result[key] = (...arg: unknown[]): unknown => {
                const { payload, handle, key: stateKey } = element;
                const resPayload = payload(...arg);

                store.dispatch({ stateKey, handle, type: key, payload: resPayload });

                return resPayload;
            };
        }
    }

    return result;
};

const transHandle = (config: ActionsConfig) => {
    const handles: HandlesType = {};

    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            handles[key] = (state: WritableDraft<StateType>, { stateKey, handle, payload }) => {
                handle ? handle(state, payload) : (state[stateKey] = payload);
            };
        }
    }

    return handles;
};

const transReducers = (initialState: StateType, handles: HandlesType) => {
    // eslint-disable-next-line default-param-last
    return produce((state = initialState, action: AnyAction) => {
        if (Object.prototype.hasOwnProperty.call(handles, action.type)) {
            /*
                immer: https://immerjs.github.io/immer/return
                use handle not return anything
            */
            handles[action.type](state, action);
        } else {
            // default return state
            return state;
        }
    });
};

const createReducer = (reducerConfig: ReducerConfig) => {
    const reducers: ReducersMapObject = {};

    for (const key in reducerConfig) {
        if (Object.prototype.hasOwnProperty.call(reducerConfig, key)) {
            const item = reducerConfig[key];
            const handles = transHandle(item.config);

            reducers[key] = transReducers(item.state, handles);
        }
    }

    return reducers;
};

/*eslint-disable */
const composeEnhancers =
    //@ts-ignore
    process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
     //@ts-ignore
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Enable capture of stack traces for dispatched Redux actions
            trace:true
        })
        : compose;
/* eslint-enable */

export const createStore = (
    reducerConfig: ReducerConfig,
    reducers: ReducersMapObject = {},
    reduxMiddleware: Middleware[] = [],
): Store => {
    const actionReducers = createReducer(reducerConfig);
    const newReducers = {
        ...actionReducers,
        ...reducers,
    };

    return reduxCreateStore(
        combineReducers(newReducers),
        composeEnhancers(applyMiddleware(reduxThunk, reduxPromise, ...reduxMiddleware)),
    );
};
