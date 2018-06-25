import { select, takeLatest, put, call } from 'redux-saga/effects';
import { isActionOf } from 'typesafe-actions';

import { RootState } from '../../reducers/interfaces';
import * as SearchActions from './actions';

export function* dismiss() {
  const { active } = yield select((state: RootState) => state.search);

  if (active) {
    yield put(isActionOf(SearchActions.toggle));
  }
}

export function* watchSearch({ metadataAdapter }) {
  yield takeLatest(FETCHING, function* ({ query }) {
    try {
      const result = yield call(metadataAdapter.quickSearch, query);

      yield put(actions.fetched(result));
    } catch (error) {
      yield put(actions.empty(error));
    }
  });
}