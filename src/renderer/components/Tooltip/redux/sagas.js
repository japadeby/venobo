import { take, delay, put, all, select } from 'redux-saga/effects'

import { ENABLE, TOGGLE } from './constants'
import config from '../../../../config'

import * as actions from './actions'

export function* dismiss() {
  const { active } = yield select(state => state.tooltip)

  if (active) {
    yield put(actions.dismiss())
  }
}

export function* watchToggle () {
  yield take([TOGGLE, ENABLE], function* () {
    while (true) {
      yield delay(config.TOOLTIP_DELAY)

      const { hovering } = select(state => state.tooltip)
      if (!hovering) {
        yield put(actions.dismiss())
      }
    }
  })
}