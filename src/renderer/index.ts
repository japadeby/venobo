import { syncHistoryWithStore } from 'mobx-react-router';
import { ipcRenderer } from 'electron';

import { RENDERER_FINISHED_LOADING } from '../common/events';
import { MetadataAdapter } from '../common/api/metadata';
import { TorrentAdapter } from '../common/api/torrent';
import { createI18n } from '../common/i18n';

import { ConfigStore } from './stores/config.store';
import { createStores } from './stores';
import { createApp } from './app';

(async () => {
  const configStore = new ConfigStore();

  const config = await configStore.load();
  createI18n(config.user.prefs.ietf);

  const torrentAdapter = new TorrentAdapter();
  const metadataAdapter = new MetadataAdapter(torrentAdapter, config);

  const stores = createStores(metadataAdapter);
  const history = syncHistoryWithStore(config.user.history, stores.router);

  stores.config = config;

  await torrentAdapter.createProviders();
  await createApp(stores, history);

  // Tell the main process that the render has finished
  // so it can show this window instead of the loading one
  ipcRenderer.emit(RENDERER_FINISHED_LOADING);
})();
