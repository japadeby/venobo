import { MovieMetadata, ShowMetadata } from '../../../api/metadata';

export interface SearchStateResults {
  //[key: string]: Metadata[];
  all: (MovieMetadata & ShowMetadata)[];
  movies: MovieMetadata[];
  shows: ShowMetadata[];
}

export interface SearchState {
  results: SearchStateResults;
  resultsEmpty: any;
  filter: 'all' | string;
  active: boolean;
  fetching: boolean;
}

export const InitialSearchState: SearchState = {
  results: {
    all: [],
    movies: [],
    shows: [],
  },
  resultsEmpty: null,
  active: false,
  filter: 'all',
  fetching: false,
};