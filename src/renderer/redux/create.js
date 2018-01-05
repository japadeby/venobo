import { createStore as _createStore, applyMiddleware, compose, combineReducers as combine } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'
import createSagaMiddleware, { END } from 'redux-saga'
import thunk from 'redux-thunk'
import _ from 'lodash'

import * as ipc from '../utils/ipc'
import MetadataAdapter from '../api/metadata/adapter'
import createReducers from './reducer'
import rootSaga from './sagas'

export function injectReducer(store, reducers, persistConfig) {
  Object.entries(reducers).forEach(([name, reducer]) => {
    if (store.asyncReducers[name]) return
    store.asyncReducers[name] = reducer.__esModule ? reducer.default : reducer
  })

  store.replaceReducer(combine(createReducers(store.asyncReducers)))
}

function getNoopReducers(reducers, data) {
  if (!data) return {}
  return Object.keys(data).reduce(
    (prev, next) => (reducers[next] ? prev : { ...prev, [next]: (state = {}) => state }),
    {}
  )
}

export default function createStore({ history, data }) {
  const sagaMiddleware = createSagaMiddleware()
  const middleware = [thunk, thunkMiddleware, sagaMiddleware, routerMiddleware(history)]

  if (__CLIENT__ && __DEVELOPMENT__) {
    const logger = require('redux-logger').createLogger({
      collapsed: true
    })
    middleware.push(logger)
  }

  const enhancers = [applyMiddleware(...middleware)]

  if (__CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools')
    const DevTools = require('../../helpers/DevTools')

    Array.prototype.push.apply(enhancers, [
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ])
  }

  const finalCreateStore = compose(...enhancers)(_createStore)
  const reducers = createReducers()
  const noopReducers = getNoopReducers(reducers, data)
  const store = finalCreateStore(combine({ ...noopReducers, ...reducers }), data)

  store.asyncReducers = {}
  store.inject = {
    reducer: _.partial(injectReducer, store, _)
  }

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      const reducer = combine(require('./reducer')(store.asyncReducers))
      store.replaceReducer(reducer)
    })
  }

  sagaMiddleware.run(rootSaga, { api: MetadataAdapter, ipc })

  return store
}
