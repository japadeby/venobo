import async from 'async'

import MetadataAdapter from '../../../api/metadata/adapter'
import * as discover from './constants'

export const setData = (params, reset = false) => (dispatch, getState) => {
  let { page, items, fetching } = getState().discover

  if (params && !fetching) {
    let itemsCount = 0

    if (!reset) {
      dispatch({ type: discover.FETCHING })
    } else {
      dispatch({ type: discover.RESET })
    }

    async.whilst(() => itemsCount < 15,
      function (done) {
        MetadataAdapter.discover(params.type, {
          page,
          sort_by: params.sortBy,
          with_genres: params.genre !== 'all'
            ? params.genre
            : ''
        })
          .then(data => {
            page++
            itemsCount += data.length
            done(null, items = items.concat(data))
          })
          .catch(() => {
            page++
            done()
          })
      }, (err, items) => {
        dispatch({ type: discover.FETCHED, items, page })
      }
    )
  }
}

export const toggleDock = () => (dispatch, getState) => {
  if (!getState().discover.navDockable) {
    dispatch({ type: discover.TOGGLE_DOCK })
  }
}

export const dismissDock = () => (dispatch, getState) => {
  if (getState().discover.navDockable) {
    dispatch({ type: discover.DISMISS_DOCK })
  }
}
