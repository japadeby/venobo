import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { RootState } from './interfaces';

import { searchReducer } from '../components/Search';

export function createReducers(appState: any) {
  return combineReducers<RootState>({
    router: routerReducer,
    search: searchReducer,
    app: (state = appState) => state,
  });
}

export * from './interfaces';