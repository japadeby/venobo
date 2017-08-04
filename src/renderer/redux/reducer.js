import { combineReducers } from 'redux'

import { searchReducer } from '../components/Search/redux'
import { tooltipReducer } from '../components/Tooltip/redux'

import { starredReducer } from '../pages/Starred/redux'
import { mediaReducer } from '../pages/Media/redux'
import { discoverReducer } from '../pages/Discover/redux'
import { homeReducer } from '../pages/Home/redux'

export default (appState) => {
  return combineReducers({
    discover: discoverReducer,
    starred: starredReducer,
    tooltip: tooltipReducer,
    search: searchReducer,
    media: mediaReducer,
    app: (state = appState) => state,
    home: homeReducer
  })
}
