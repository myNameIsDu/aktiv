import React, { type FC, createContext } from 'react';

export type LauncherContextProps = {
    basename?: string;
};

export const LauncherContext = createContext<LauncherContextProps>({});

export type LauncherProviderProps = {
    value: Record<string, any>;
};

const LauncherProvider: FC<LauncherProviderProps> = ({ children, value }) => {
    return <LauncherContext.Provider value={value}>{children}</LauncherContext.Provider>;
};

export default LauncherProvider;
