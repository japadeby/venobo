import * as React from 'react';
import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import * as ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { createMemoryHistory } from 'history';

import { configureStore } from './store';
import { TorrentAdapter } from '../api/torrent';
import { MetadataAdapter } from '../api/metadata';
import { RENDERER_FINISHED_LOADING } from '../events';

(async () => {
  const history = createMemoryHistory();
  const torrentAdapter = new TorrentAdapter();
  const metadataAdapter = new MetadataAdapter(torrentAdapter);

  await torrentAdapter.createProviders();
  const store = await configureStore(history, metadataAdapter);

  const render = async () => {
    const { routes } = await import('./routes');

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

  // Tell the main process that the render has finished
  // so it can show this window instead of the loading one
  ipcRenderer.emit(RENDERER_FINISHED_LOADING);

  if (module.hot) {
    module.hot.accept(render);
  }
})();