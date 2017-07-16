import { TOGGLE, DISMISS, ENABLE, DISABLE } from './actions'

const initialState = {
  data: {},
  enabled: false,
  poster: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        enabled: true,
        data: action.payload
      }
    case DISMISS:
      return {
        ...state,
        enabled: false
      }
    case ENABLE:
      return {
        ...state,
        poster: false
      }
    case DISABLE:
      return {
        ...state,
        poster: true
      }
    default:
      return state
  }
}
