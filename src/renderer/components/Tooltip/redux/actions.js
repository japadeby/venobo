import { TOGGLE, ENABLE, DISMISS } from './constants'

export default new (class tooltipActions {

  timeout

  toggle = (data = {}) => (dispatch) => {
    clearTimeout(this.timeout)
    dispatch({ type: TOGGLE, payload: data })
  }

  setTooltipEnabled = () => (dispatch) => {
    clearTimeout(this.timeout)
    dispatch({ type: ENABLE })
  }

  setTooltipDisabled = () => {
    this.timeout = setTimeout(this.setDisabled, 400) // state.tooltip.delay
  }

  setDisabled = () => (dispatch, getState) => {
    if (!getState.tooltip.poster) {
      dispatch({ type: DISMISS })
    }
  }

})
