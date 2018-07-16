import { observable, action } from 'mobx';
import { MetadataAdapter, MovieMetadata, ShowMetadata } from '../../common/api/metadata';

export class HomeStore {

  @observable isReady: boolean = false;

  @observable movies: { [key: string]: MovieMetadata[] } = {};

  @observable shows: { [key: string]: ShowMetadata[] } = {};

  constructor(private readonly metadataAdapter: MetadataAdapter) {}

  @action async fetch() {
    const popular = await Promise.all([
      this.metadataAdapter.getPopular('movies'),
      //this.metadataAdapter.getPopular('shows'),
    ]);

    const topRated = await Promise.all([
      this.metadataAdapter.getTopRated('movies'),
      //this.metadataAdapter.getTopRated('shows'),
    ]);

    console.log(popular, topRated);

    this.movies = {
      topRated: topRated[0],
      popular: popular[0],
    };

    this.isReady = true;
  }

}