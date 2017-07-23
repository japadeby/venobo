import { combineReducers } from 'redux'

import { searchReducer } from '../components/Search/redux'
import { tooltipReducer } from '../components/Tooltip/redux'

import { mediaReducer } from '../containers/Media/redux'
import { discoverReducer } from '../containers/Discover/redux'
import { homeReducer } from '../containers/Home/redux'

export default (appState) => {
  return combineReducers({
    discover: discoverReducer,
    tooltip: tooltipReducer,
    search: searchReducer,
    media: mediaReducer,
    app: (state = appState) => state,
    home: homeReducer
  })
}
