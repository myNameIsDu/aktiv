import isPlainObject from './isPlainObject';
import { isString } from './isType';
import type { AnyAction } from 'redux';

function isValidKey(key: string) {
    return ['type', 'payload', 'error', 'meta', 'handle', 'stateKey'].indexOf(key) > -1;
}
export default function isFSA(action: AnyAction): boolean {
    return isPlainObject(action) && isString(action.type) && Object.keys(action).every(isValidKey);
}
