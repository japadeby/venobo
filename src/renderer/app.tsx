import * as React from 'react';
import { Provider } from 'mobx-react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { History } from 'history';

import { RootStore } from './stores';
import './app.css';

export async function createApp(stores: RootStore, history: History) {
  const render = async () => {
    console.log('Render');
    const { createRoutes } = await import('./routes');

    ReactDOM.render(
      <AppContainer>
        <Provider {...stores}>
          <Router history={history}>
            {createRoutes()}
          </Router>
        </Provider>
      </AppContainer>,
      document.getElementById('app') as HTMLElement,
    );
  };

  await render();

  if (module.hot) {
    module.hot.accept(render);
  }
}
