import HttpSources from '../lib/http/sources'

export function* watchLocationChange({ api }) {
  yield takeLatest('LOCATION_CHANGE', function* () {
    HttpSources.cancelAll()
  })
}
