import {combineReducers} from 'redux';
import { RootState } from './interfaces';
import { routerReducer } from 'react-router-redux';

export * from './interfaces';

export function createReducers(appState: any) {
  return combineReducers<RootState>({
    router: routerReducer,
    app: (state = appState) => state,
  });
}