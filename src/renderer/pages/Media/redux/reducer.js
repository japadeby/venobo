import { FETCHED, FETCHING, PAGINATE } from './constants'

const initialState = {
  data: {},
  isReady: false,
  pagination: null,
  episodes: null,
  navigation: null
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        isReady: false
      }

    case FETCHED:
      return {
        ...state,
        data: action.data,
        isReady: true
      }

    case PAGINATE:
      return {
        ...state,
        pagination: action.pagination,
        episodes: action.episodes,
        navigation: action.navigation
      }

    default:
      return state
  }
}
