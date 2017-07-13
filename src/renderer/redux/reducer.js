import { combineReducers } from 'redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'

import { searchReducer } from '../components/Search/redux'

import { discoverReducer } from '../containers/Discover/redux'
import { homeReducer } from '../containers/Home/redux'

export default function createReducer(appState) {
  return combineReducers({
    discover: discoverReducer,
    search: searchReducer,
    home: homeReducer,
    reduxAsyncConnect,
    app: appState
  })
}
