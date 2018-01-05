import { select, put } from 'redux-saga/effects'
import { routerActions } from 'react-router-redux'

import { ipc } from '../utils'

import { rootState } from './selectors'
import { searchActions } from '../components/Search/redux'

export function* escapeBack() {
  const state = yield select(rootState)

  if (state.modal) {
    // ... state.modal
  } else if (state.search.enabled) {
    yield put(searchActions.toggle())
  } else if (state.window.isFullScreen) {
    yield call(ipc.toggleFullScreen)
  } else if (!state.location.includes('player')) {
    yield put(routerActions.goBack)
  }

}