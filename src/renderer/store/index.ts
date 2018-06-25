import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { middleware as thunkMiddleware } from 'redux-saga-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import isDevMode from 'electron-is-dev';
import { History } from 'history';

import { rootSaga } from '../sagas';
import { RootState, createReducers } from '../reducers';
import { MetadataAdapter } from '../../api/metadata';

export async function configureStore(history: History, metadataAdapter: MetadataAdapter, initialState: RootState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [thunkMiddleware, sagaMiddleware, routerMiddleware(history)];

  if (isDevMode) {
    const { createLogger } = await import('redux-logger');

    const logger = createLogger({
      collapsed: true,
    });

    middleware.push(logger);
  }

  const enhancers = applyMiddleware(...middleware);
  const store = createStore(createReducers(null), initialState, enhancers); // as Store<RootState>;

  if (module.hot) {
    module.hot.accept(async () => {
      const { createReducers } = await import('../reducers');
      store.replaceReducer(createReducers());
    });
  }

  sagaMiddleware.run(rootSaga, { metadataAdapter });

  return store;
}