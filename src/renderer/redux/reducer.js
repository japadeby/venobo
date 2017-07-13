import { combineReducers } from 'redux'

import { searchReducer } from '../components/Search/redux'

import { discoverReducer } from '../containers/Discover/redux'
import { homeReducer } from '../containers/Home/redux'

export default function createReducer(appState) {
  return combineReducers({
    discover: discoverReducer,
    search: searchReducer,
    home: homeReducer,
    app: appState
  })
}
