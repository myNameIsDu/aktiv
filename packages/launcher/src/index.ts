export { default as withRouter } from './module/withRouter';
export { createActions } from './store';
export * from 'react-router-dom';
export * from 'react-redux';
export * from 'redux';
export * from 'immer';
export * from './hooks';
import Launcher from './module/app';
export default Launcher;

export type {
    DynamicImportType,
    RouteItem,
    ConstructorOptionsType,
    RouteItemBase,
} from './module/app';
export type {
    PluginInnerRenderType,
    PluginOuterRenderType,
    Plugin,
    PluginOpt,
} from './module/wrapperInit';
export type {
    ReducerConfig,
    ReducerConfigItem,
    StateType,
    ActionsConfig,
    ResultActionTypes,
    ActionItem,
    PayloadType,
} from './store';
export type { UseRouterReturns, UseRouterState } from './hooks/use-router';
export type { HocExtraProps } from './module/withRouter';
