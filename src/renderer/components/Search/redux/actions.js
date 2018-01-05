import * as search from './constants'

const create = (action, data = {}) => ({ type: search[action], ...data })

export const toggle = () => create('TOGGLE')

export const filter = (filter) => create('FILTER', { filter })

export const fetched = (result) => create('FETCHED', { result })

export const fetch = (query) => create('FETCHING', { query })