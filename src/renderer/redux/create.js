import { createStore, applyMiddleware, compose } from 'redux'
//import { routerMiddleware } from 'react-router-redux'
//import Immutable from 'immutable'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import config from '../../../config'
import reducer from './reducer'

export default function createStore(appState) {
  //const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = [logger, thunk]

  let finalCreateStore
  if (config.IS.DEV) {
    const { persistState } = require('redux-devtools')
    const { DevTools } = require('../components')

    finalCreateStore = compose(
      applyMiddleware(...middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(createStore)
  }

  //const reducer = createReducer(state)
  return finalCreateStore(reducer)
}
