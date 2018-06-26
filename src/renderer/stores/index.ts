import { RouterStore } from 'mobx-react-router';

import { MetadataAdapter } from '../../api/metadata';
import { SearchStore } from './search.store';
import { ConfigState } from './config.store';

export interface RootStore {
  search: SearchStore;
  router: RouterStore;
  config?: ConfigState;
}

export const createStores = (metadataAdapter: MetadataAdapter): RootStore => ({
  search: new SearchStore(metadataAdapter),
  router: new RouterStore(),
 //config: new ConfigStore(),
});
