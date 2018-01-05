import { TOGGLE, DISMISS, ENABLE, DISABLE } from './actions'

const initialState = {
  data: {},
  hovering: null,
  active: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        active: true,
        hovering: true,
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
        hovering: true
      }
    case DISABLE:
      return {
        ...state,
        hovering: false
      }
    default:
      return state
  }
}
