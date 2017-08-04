import { SET_ITEMS, EMPTY, FETCHING, FETCHED } from './constants'

const initialState = {
  items: {
    movies: [],
    shows: []
  },
  isReady: false
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ITEMS:
      return {
        ...state,
        items: action.items
      }
    case FETCHING:
      return {
        ...state,
        isReady: false
      }
    case FETCHED:
      return {
        ...state,
        isReady: true,
        items: action.items
      }
    case EMPTY:
      return {
        ...state,
        isReady: true
      }
    default:
      return state
  }
}
