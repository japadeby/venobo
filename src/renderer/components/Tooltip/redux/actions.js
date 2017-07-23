import { TOGGLE, ENABLE, DISMISS, DISABLE } from './constants'
import config from '../../../../config'

export var timeout

export const toggleTooltip = (payload = {}) => (dispatch, getState) => {
  if (!getState().tooltip.active) {
    dispatch({ type: TOGGLE, payload })
  }
}

export const dismissTooltip = () => (dispatch, getState) => {
  if (getState().tooltip.active) {
    dispatch({ type: DISMISS })
  }
}

export const setTooltipEnabled = () => (dispatch) => {
  clearTimeout(timeout)
  dispatch({ type: ENABLE })
}

export const setTooltipDisabled = () => (dispatch) => {
  dispatch({ type: DISABLE })
  timeout = setTimeout(dismissTooltip, config.TOOLTIP_DELAY) // state.tooltip.delay
}
