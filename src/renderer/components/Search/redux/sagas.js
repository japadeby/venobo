import { select, takeLatest, put } from 'redux-saga/effects'

import * as actions from './actions'
import { FETCHING } from './constants'

export function* dismiss() {
  const { active } = yield select(state => state.search)

  if (active) {
    yield put(actions.toggle())
  }
}

export function* watchSearch({ api }) {
  yield takeLatest(FETCHING, function* ({ query }) {
    try {
      const result = yield call(api.quickSearch, query)

      yield put(actions.fetched(result))
    } catch (error) {
      yield put(actions.empty(error))
    }
  })
}