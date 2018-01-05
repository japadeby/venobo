import { takeLatest, all, fork, put } from 'redux-saga/effects'

import * as actions from './actions'
import { FETCHING } from './constants'

export function* watchFetch({ api }) {
  yield takeLatest(FETCHING, function* ({ meta }) {
    const [movies, shows] = yield all([
      all({
        popular: fork(api.getPopular, 'movies'),
        topRated: fork(api.getTopRated, 'movies')
      }),
      all({
        popular: fork(api.getPopular, 'shows'),
        topRated: fork(api.getTopRated, 'shows')
      })
    ])

    yield put(actions.fetched({ movies, shows }, meta))
  })
}