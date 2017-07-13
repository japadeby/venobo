import { FETCHING, FETCHED } from './constants'

const initialState = {
  navDockable: false,
  fetched: false,
  items: [],
  fetching: false,
  page: 1,
  lastScrollTop: 0,
  params: {}
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
        fetched: true,
        fetching: false,
        items: action.items,
        page: action.page
      }
    default:
      return state
  }
}
