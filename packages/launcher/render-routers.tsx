import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import loadable from 'react-loadable';
import loading from './loading';
import type { RouteItem, RouteComponentPropsType, DynamicImportType } from './index';
import type { ComponentType } from 'react';

const renderRoutes = (routes: Array<RouteItem> | undefined): Array<ReactNode> => {
    return routes
        ? routes.map(item => {
              const { path, component, lazy, children } = item;

              if (lazy) {
                  const LoadCom = loadable({
                      loader: component as () => DynamicImportType,
                      loading,
                  });

                  return (
                      <Route key={path} path={path} element={<LoadCom />}>
                          {renderRoutes(children)}
                      </Route>
                  );
              }

              const Com = component as ComponentType<RouteComponentPropsType>;

              return (
                  <Route key={path} path={path} element={<Com />}>
                      {renderRoutes(children)}
                  </Route>
              );
          })
        : [];
};

export default renderRoutes;
