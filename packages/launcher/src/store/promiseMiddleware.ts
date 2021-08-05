import isFSA from '../utils/isFSA';
import { isPromise } from '../utils/isType';

import type { Dispatch as ReduxDispatch, AnyAction, MiddlewareAPI } from 'redux';

export default function promiseMiddleware({ dispatch }: MiddlewareAPI) {
    return (next: ReduxDispatch) =>
        (action: AnyAction): any => {
            if (!isFSA(action)) {
                return isPromise(action) ? action.then(dispatch) : next(action);
            }

            return isPromise(action.payload)
                ? action.payload
                      .then((result: any) => dispatch({ ...action, payload: result }))
                      .catch((error: any) => {
                          dispatch({ ...action, payload: error, error: true });

                          return Promise.reject(error);
                      })
                : next(action);
        };
}
