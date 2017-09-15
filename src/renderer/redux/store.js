import { createStore as _createStore, applyMiddleware, compose } from 'redux'
//import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import { setupDispatchHandlers } from '../lib/dispatcher'

import config from '../../config'
import createReducer from './reducer'

export default function createStore(appState, history) {
  const middleware = [thunk]//[thunk, routerMiddleware(history)]
  const rootReducer = createReducer(appState)

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

  const store = finalCreateStore(rootReducer)

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      // Setup dispatch handlers
      store.replaceReducer(rootReducer)
      setupDispatchHandlers(appState, store)
    })
  }

  return store
}
