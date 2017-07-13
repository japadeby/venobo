import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import config from '../../config'
import createReducer from './reducer'

export default function createStore(appState) {
  const middleware = [logger, thunk]

  let finalCreateStore
  if (config.IS.DEV) {
    const { persistState } = require('redux-devtools')
    const { DevTools } = require('../components')

    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const reducer = createReducer(appState)
  return finalCreateStore(reducer)
}
