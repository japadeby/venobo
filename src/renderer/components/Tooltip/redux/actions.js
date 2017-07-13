import { TOGGLE, ENABLE, DISMISS } from './constants'

export var timeout

export const toggleTooltip = (enabled, payload = {}) => (dispatch) => {
  clearTimeout(timeout)
  dispatch({ type: TOGGLE, enabled, payload })
}

export const dismissTooltip = () => (dispatch, getState) => {
  if (getState.tooltip.enabled) {
    clearTimeout(timeout)
    dispatch({ type: DISMISS })
  }
}

export const setTooltipEnabled = () => (dispatch) => {
  clearTimeout(timeout)
  dispatch({ type: ENABLE })
}

export const setTooltipDisabled = () => {
  timeout = setTimeout(setDisabled, 400) // state.tooltip.delay
}

const setDisabled = () => (dispatch, getState) => {
  if (!getState.tooltip.poster) {
    dispatch({ type: DISMISS })
  }
}
