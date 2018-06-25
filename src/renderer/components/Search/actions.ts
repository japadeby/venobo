import { createAction } from 'typesafe-actions';

import { SearchStateResults } from './state';

export const toggle = createAction('SEARCH_TOGGLE');
export const filter = createAction('SEARCH_FILTER', (filter: string) => ({
  type: 'SEARCH_FILTER',
  payload: filter,
}));
export const fetched = createAction('SEARCH_FETCHED', (result: SearchStateResults) => ({
  type: 'SEARCH_FETCHED',
  payload: result,
}));
export const fetch = createAction('SEARCH_FETCH', (query: string) => ({
  type: 'SEARCH_FETCH',
  payload: query,
}));