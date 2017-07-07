import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
//import Immutable from 'immutable'
import thunk from 'redux-thunk'

import config from '../../../config'
import createReducer from './reducer'

export default function createStore(history, state) {
  const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = [reduxRouterMiddleware, thunk]

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

  //if (data) data.pagination = Immutable.fromJS(data.pagination)
  const reducer = createReducer(state)
  return finalCreateStore(reducer)
}
