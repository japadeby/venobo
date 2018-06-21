import { Store, createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { middleware as thunkMiddleware } from 'redux-saga-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import { History } from 'history';

import { rootSaga } from '../sagas';
import { RootState, createReducers } from '../reducers';
import { MetadataAdapter } from '../../api/metadata';

export async function configureStore(history: History, metadataAdapter: MetadataAdapter, initialState: RootState = {}): Store<RootState> {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [thunkMiddleware, sagaMiddleware, routerMiddleware(history)];

  if (true) {
    const logger = require('redux-logger').createLogger({
      collapsed: true,
    });

    middleware.push(logger);
  }

  const enhancers = applyMiddleware(...middleware);
  const store = createStore(createReducers(null), initialState, enhancers) as Store<RootState>;

  if (module.hot) {
    module.hot.accept(async () => {
      const {createReducers} = await import('../reducers');
      store.replaceReducer(createReducers());
    });
  }

  sagaMiddleware.run(rootSaga, { metadataAdapter });

  return store;
}