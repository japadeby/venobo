import { TOGGLE, FETCHING, EMPTY, FILTER } from './constants'
import MetadataAdapter from '../../api/metadata/adapter'

export const searchToggle = (active) => (dispatch) => dispatch({ type: TOGGLE, active })

export const searchFilter = (filter) => (dispatch) => dispatch({ type: FILTER, filter })

export const searchAction = (searchQuery) => {
  return (dispatch, getState) => {
    if (!getState.search.fetching) {
      dispatch({ type: FETCHING })
    }

    MetadataAdapter.quickSearch(searchQuery)
      .then(res => {
        const payload = {
          all: res,
          movies: res.filter(
            media => media.type == 'movie'
          ),
          shows: res.filter(
            media => media.type == 'show'
          )
        }

        dispatch({ type: FETCHED, payload })
      })
      .catch(error => dispatch({ type: EMPTY, error }))
  }
}
