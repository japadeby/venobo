import * as React from 'react';
import { Provider } from 'mobx-react';
import * as ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { Router } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { History } from 'history';

import { RootStore } from './stores';

export async function createApp(stores: RootStore, history: History) {
  const render = async () => {
    const { routes } = await import('./routes');

    ReactDOM.render(
      <AppContainer>
        <Provider {...stores}>
          <Router history={history}>
            {renderRoutes(routes)}
          </Router>
        </Provider>
      </AppContainer>,
      document.getElementById('app') as HTMLDivElement,
    );
  };

  await render();

  if (module.hot) {
    module.hot.accept(render);
  }
}
