import async from 'async'

import MetadataAdapter from '../../../api/metadata/adapter'
import { FETCHING, FETCHED } from './constants'

export function setData() {
  return (dispatch, state) => {
    let { params, page, items, fetching } = state.discover

    if (params && !fetching) {
      let itemsCount = 0

      dispatch({ type: FETCHING })

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
          dispatch({
            type: FETCHED,
            items,
            page
          })
        }
      )
    }
  }
}

export function onScroll() {

}
