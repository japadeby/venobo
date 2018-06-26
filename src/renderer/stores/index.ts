import { RouterStore } from 'mobx-react-router';

import { MetadataAdapter } from 'src/api/metadata';
import { SearchStore } from './search.store';
import { ConfigState } from './config.store';

export interface MobxStores {
  search: SearchStore;
  router: RouterStore;
  config?: ConfigState;
}

export const createStores = (metadataAdapter: MetadataAdapter): MobxStores => ({
  search: new SearchStore(metadataAdapter),
  router: new RouterStore(),
 //config: new ConfigStore(),
});
