import { produce } from 'immer';
import { createStore as reduxCreateStore, compose, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from './promiseMiddleware';
import type { Store, ReducersMapObject, AnyAction } from 'redux';
import type {} from 'immer';

export type { ReducersMapObject, Store };
/* eslint-disable */
let store: Store;
/* eslint-enable*/

export const initialStore = (s: Store): void => {
    store = s;
};

type WritableDraft<T> = {
    -readonly [K in keyof T]: T[K];
};
type StateType = {
    readonly [x: string]: any;
};
type PayloadType = any;

type ActionItem = {
    key: string;
    payload: (...arg: any[]) => any;
    handle?: (s: StateType, p: PayloadType) => any;
};

type ActionsConfig = {
    [x: string]: ActionItem;
};

type ResultActionTypes = {
    [x: string]: (...arg: any[]) => any;
};

export type ReducerConfigItem = {
    state: StateType;
    config: ActionsConfig;
};

export type ReducerConfig = {
    [x: string]: ReducerConfigItem;
};

interface HandleType {
    (s: StateType, a: AnyAction): any;
}
interface HandlesType {
    [x: string]: HandleType;
}

export const createActions = (actionsConfig: ActionsConfig): ResultActionTypes => {
    const result: ResultActionTypes = {};

    for (const key in actionsConfig) {
        if (Object.prototype.hasOwnProperty.call(actionsConfig, key)) {
            const element = actionsConfig[key];

            // eslint-disable-next-line no-loop-func
            result[key] = (...arg) => {
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
                use handle return nothing
                default return state
            */
            handles[action.type](state, action);
        } else {
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
            
          })
        : compose;
/* eslint-enable */

export const createStore = (
    reducerConfig: ReducerConfig,
    reducer: ReducersMapObject = {},
): Store => {
    const actionsReducer = createReducer(reducerConfig);
    const newReducers = {
        ...actionsReducer,
        ...reducer,
    };

    return reduxCreateStore(
        combineReducers(newReducers),
        applyMiddleware(reduxThunk, reduxPromise),
    );
};
