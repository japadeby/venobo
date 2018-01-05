import { takeLatest, call } from 'redux-saga/effects'

import { FETCHING } from './constants'
import * as actions from './actions'
import MetadataAdapter from '../../../api/metadata/adapter'

export function* watchFetch({ api, ipc }) {
  yield takeLatest(FETCHING, function* ({ tmdb, type, meta }) {
    try {
      const method = type === 'movie'
        ? 'getMovieById'
        : 'getShowById'

      const payload = yield all({
        media: call(api[method], tmdb),
        similar: call(api.getSimilar, type, tmdb),
        recommended: call(api.getRecommendations, type, tmdb)
      })

      ipc.setTitle(payload.media.title)

      yield put(actions.fetchSuccess(payload, meta))
    } catch (error) {
      yield put(actions.fetchFail(error, meta))
    }
  })
}