import * as React from 'react';
import { ipcRenderer } from 'electron';
import { Provider } from 'mobx-react';
import * as ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'mobx-react-router';
import { AppContainer } from 'react-hot-loader';
import { createMemoryHistory } from 'history';

import { createStores } from './stores';
import { TorrentAdapter } from '../api/torrent';
import { MetadataAdapter } from '../api/metadata';
import { RENDERER_FINISHED_LOADING } from '../events';
import { ConfigStore } from './stores/config.store';

(async () => {
  const memoryHistory = createMemoryHistory();
  const configStore = new ConfigStore();

  const config = await configStore.load();

  const torrentAdapter = new TorrentAdapter();
  const metadataAdapter = new MetadataAdapter(torrentAdapter, config);

  await torrentAdapter.createProviders();
  const stores = createStores(metadataAdapter);
  const history = syncHistoryWithStore(memoryHistory, stores.router);

  stores.config = config;

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
