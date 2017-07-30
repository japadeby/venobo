import { TOGGLE, ENABLE, DISMISS, DISABLE } from './constants'
import config from '../../../../config'

export var timeout

export const toggleTooltip = (payload = {}) => {
  return (dispatch, getState) => {
    dispatch({ type: TOGGLE, payload })
  }
}

export const dismissTooltip = () => {
  return (dispatch, getState) => {
    if (getState().tooltip.active) {
      dispatch({ type: DISMISS })
    }
  }
}

export const dismissTooltipDelay = (e ) => {
  return (dispatch, getState) => {
    timeout = setTimeout(() => {
      if (!getState().tooltip.active) {
        dispatch({ type: DISMISS })
      }
    }, config.TOOLTIP_DELAY)
  }
}
