import { FETCHED } from './constants'

const initialState = {
  isReady: false,
  media: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCHED:
      return {
        ...state,
        isReady: true,
        media: action.media
      }
    default:
      return state
  }
}
