import { TOGGLE, ENABLE, DISMISS, DISABLE } from './constants'
import config from '../../../../config'

export var timeout

export const toggleTooltip = (enabled, payload = {}) => (dispatch) => {
  clearTimeout(timeout)
  dispatch({ type: TOGGLE, enabled, payload })
}

export const dismissTooltip = () => (dispatch, getState) => {
  if (!getState().tooltip.poster) {
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
