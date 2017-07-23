import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import config from '../../config'
import createReducer from './reducer'

export default function createStore(appState) {
  const middleware = [logger, thunk]

  if (config.IS.DEV) {
    const { persistState } = require('redux-devtools')
    const { DevTools } = require('../components')

    const finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore)
  } else {
    const finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const store = finalCreateStore(createReducer)

  if (config.IS.DEV && module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'))
    })
  }

  return store
}
