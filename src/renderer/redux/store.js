import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import {setupDispatchHandlers} from '../lib/dispatcher'

import config from '../../config'
import createReducer from './reducer'

export default function createStore(appState) {
  const middleware = [thunk, logger]

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

  const store = finalCreateStore(createReducer(appState))

  if (config.IS.DEV && module.hot) {
    module.hot.accept(() => {
      // Setup dispatch handlers
      store.replaceReducer(require('./reducer')(appState))
      setupDispatchHandlers(appState, store)
    })
  }

  return store
}
