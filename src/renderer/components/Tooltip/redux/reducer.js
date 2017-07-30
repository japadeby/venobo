import { TOGGLE, DISMISS, ENABLE, DISABLE } from './actions'

const initialState = {
  data: {},
  active: false,
  poster: false
}

export default (state = initialState, action) => {
  console.log(state, action)
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        active: true,
        data: action.payload
      }
    case DISMISS:
      return {
        ...state,
        active: false,
        data: {}
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
