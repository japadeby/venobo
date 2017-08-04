import * as discover from './constants'

const initialState = {
  navDockable: false,
  fetched: false,
  items: [],
  fetching: false,
  page: 1,
  lastScrollTop: 0,
  isReady: false
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case discover.FETCHING:
      return {
        ...state,
        fetching: true
      }
    case discover.FETCHED:
      return {
        ...state,
        isReady: true,
        fetched: true,
        fetching: false,
        items: action.items,
        page: action.page
      }
    case discover.RESET:
      return {
        ...state,
        ...initialState,
        fetching: true
      }
    case discover.TOGGLE_DOCK:
      return {
        ...state,
        navDockable: true
      }
    case discover.DISMISS_DOCK:
      return {
        ...state,
        navDockable: false
      }
    default:
      return state
  }
}
