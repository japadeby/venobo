import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import * as ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { createMemoryHistory } from 'history';

import { configureStore } from './store';
import { routes } from './routes';

(async () => {
  const history = createMemoryHistory();
  const store = await configureStore(history);

  const render = async () => {
    const { App } = await import('./app');

    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      </AppContainer>,
      document.getElementById('App') as HTMLElement
    );
  };

  await render();

  if (module.hot) {
    module.hot.accept(async () => {
      await render();
    });
  }
})();