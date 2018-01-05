import { all, put, fork, takeEvery, call, takeLatest } from 'redux-saga/effects'

import HttpSources from '../lib/http/sources'
import * as handlers from './handlers'

import { mediaSagas } from '../containers/Media/redux'
import { searchActions, searchSagas } from '../components/Search/redux'
import { tooltipActions, tooltipSagas } from '../components/Tooltip/redux'

const forkHelpers = (helpers) => (sagas) => Object.keys(sagas).map(key => fork(sagas[key], helpers))

function* watchIpc() {
  yield takeEvery('@@electron/IPC', function* ({ method, args }) {
    const handler = handlers[method]
    if (handler instanceof GeneratorFunction) {
      yield fork(handler, ...args)
    } else {
      yield call(console.error, `Missing dispatch handler: ${action}`)
    }
  })
}

function* watchLocationChange() {
  yield takeEvery('LOCATION_CHANGE', function* () {
    yield all([
      call(HttpSources.cancelAll),
      fork(searchSagas.dismiss),
      fork(tooltipSagas.dismiss)
    ])
  })
}


export default function* rootSaga(helpers: Object) {
  const mapFork = forkHelpers(helpers)

  yield all([
    watchIpc,
    watchLocationChange,
    ...mapFork(tooltipSagas),
    ...mapFork(mediaSagas),
    ...mapFork(searchSagas)
  ])
}