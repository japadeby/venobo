import { FETCHED, FETCHING } from './constants'

const initialState = {
  isReady: false,
  media: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        isReady: false
      }

    case FETCHED:
      return {
        ...state,
        isReady: true,
        media: action.payload
      }
    default:
      return state
  }
}
