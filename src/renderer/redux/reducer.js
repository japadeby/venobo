import { combineReducers } from 'redux'

import { searchReducer } from '../components/Search/redux'
import { tooltipReducer } from '../components/Tooltip/redux'

import { discoverReducer } from '../containers/Discover/redux'
import { homeReducer } from '../containers/Home/redux'

export default combineReducers({
  discover: discoverReducer,
  tooltip: tooltipReducer,
  search: searchReducer,
  home: homeReducer
})
