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

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        fetching: true
      }
    case FETCHED:
      return {
        ...state,
        results: {
          all: action.result,
          movies: action.result.filter(
            media => media.type === 'movie'
          ),
          shows: action.result.filter(
            media => media.type === 'show'
          )
        },
        filter: 'all',
        resultsEmpty: false,
        fetching: false
      }
    case TOGGLE:
      return {
        ...state,
        active: !state.active
      }
    case EMPTY:
      return {
        ...state,
        fetching: false,
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
