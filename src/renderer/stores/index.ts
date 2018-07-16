import { RouterStore } from 'mobx-react-router';

import { MetadataAdapter } from '../../common/api/metadata';
import { SearchStore } from './search.store';
import { ConfigState } from './config.store';
import { HomeStore } from './home.store';

export interface RootStore {
  search: SearchStore;
  router: RouterStore;
  home: HomeStore;
  config?: ConfigState;
}

export const createRootStore = (metadataAdapter: MetadataAdapter): RootStore => ({
  search: new SearchStore(metadataAdapter),
  home: new HomeStore(metadataAdapter),
  router: new RouterStore(),
 //config: new ConfigStore(),
});
