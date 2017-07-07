import { combineReducers } from 'redux'
import multireducer from 'multireducer'
import { routerReducer } from 'react-router-redux'
import { router as reduxAsyncConnect } from 'redux-async-connect'

import { searchReducer } from '../components/Search/redux'

import { homeReducer } from '../containers/Home/redux'

export default combineReducers({
  search: searchReducer,
  home: homeReducer,
  routing: routerReducer,
  reduxAsyncConnect
})
