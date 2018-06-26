import { observable, action } from 'mobx';
import { fromPromise } from 'rxjs/observable';
import { MetadataAdapter } from 'src/api/metadata';

export class SearchStore {

  @observable active: boolean = false;

  constructor(private readonly metadataAdapter: MetadataAdapter) {}

  @action toggle = () => this.active = !this.active;

  @action async search(query: string) {
    try {
      const result = await this.metadataAdapter.quickSearch(query);
    } catch (e) {

    }
  }

}
