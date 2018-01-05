import * as tooltip from './constants'
const create = (action, data = {}) => ({ type: tooltip[action], ...data })

export const enable = () => create('ENABLE')

export const disable = () => create('DISABLE')

export const toggle = ({ data, eventHandler }) => create('TOGGLE', { data, eventHandler })

export const dismiss = () => create('DISMISS')