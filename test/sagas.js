import { select, put } from 'redux-saga/effects'
import { ipc } from '../utils'
//import dispatch from '../src/renderer/lib/dispatcher'

import { rootState } from './selectors'
import { TOGGLE } from '../src/renderer/components/Search/redux/constants'

export function* escapeBack() {
  const state = select(rootState)

  if (state.modal) {
    // ... state.modal
  } else if (state.search.enabled) {
    yield put({ type: TOGGLE })
  } else if (state.window.isFullScreen) {
    ipc.toggleFullScreen()
  } else if (!state.location.includes('player')) {
    dispatch('back')
  }

}