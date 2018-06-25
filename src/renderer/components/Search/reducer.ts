import { getType } from 'typesafe-actions';

import { SearchState, InitialSearchState } from './state';
import * as SearchActions from './actions';
import { RootAction } from '../../actions/root.action';

export function searchReducer(state: SearchState = InitialSearchState, action: RootAction<any>): SearchState {
  switch (action.type) {
    case getType(SearchActions.fetch):
      return {
        ...state,
        fetching: true,
      };

    case getType(SearchActions.fetched):
      return {
        ...state,
        results: {
          all: action.payload,
          movies: action.payload.filter(
            media => media.type === 'movie'
          ),
          shows: action.payload.filter(
            media => media.type === 'shows'
          )
        },
        filter: 'all',
        resultsEmpty: false,
        fetching: false,
      };

    default:
      return state;
  }
}
