import { FETCHING, FETCHED, TOGGLE, DISMISS, EMPTY, FILTER } from './constants'

const initialState = {
  results: {
    all: [],
    movies: [],
    shows: []
  },
  resultsEmpty: null,
  active: false,
  filter: 'all',
  fetching: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        fetching: true
      }
    case FETCHED:
      return {
        ...state,
        results: action.payload,
        filter: 'all',
        resultsEmpty: false,
        fetching: false
      }
    case TOGGLE:
      return {
        ...state,
        active: (action.active || !state.active)
      }
    case EMPTY:
      return {
        ...state,
        resultsEmpty: true
      }
    case FILTER:
      return {
        ...state,
        filter: action.filter
      }
    default:
      return state
  }
}
