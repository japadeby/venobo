import { syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';
import { ipcRenderer } from 'electron';

import { RENDERER_FINISHED_LOADING } from '../common/events';
import { MetadataAdapter } from '../common/api/metadata';
import { TorrentAdapter } from '../common/api/torrent';
import { createI18n } from '../common/i18n';

import { ConfigStore } from './stores/config.store';
import { createRootStore } from './stores';
import { createApp } from './app';

(async () => {
  const configStore = new ConfigStore();

  const config = await configStore.load();
  createI18n(config.user.prefs.ietf);

  const torrentAdapter = new TorrentAdapter();
  const metadataAdapter = new MetadataAdapter(torrentAdapter, config);

  const rootStore = createRootStore(metadataAdapter);
  const browserHistory = createBrowserHistory( {
    forceRefresh: true,
  });
  const history = syncHistoryWithStore(browserHistory, rootStore.router);

  history.listen(console.log);

  rootStore.config = config;

  await torrentAdapter.createProviders();
  await createApp(rootStore, history);

  // Tell the main process that the render has finished
  // so it can show this window instead of the loading one
  console.log(RENDERER_FINISHED_LOADING);
  ipcRenderer.emit(RENDERER_FINISHED_LOADING);
})();
