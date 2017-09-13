import { SET_ITEMS, FETCHED, EMPTY, FETCHING } from './constants'

import MetadataAdapter from '../../../api/metadata/adapter'

import async from 'async'

export const onUnstar = (type, tmdb) => (dispatch, getState) => {
  const {items} = getState().starred

  items[type] = items[type].filter(
    media => media.tmdb !== tmdb
  )

  dispatch({ type: SET_ITEMS, items })
}

function get(type, starred, done) {
  const method = type === 'shows'
    ? 'checkShow'
    : 'getMovieById'

  let media = []

  async.each(starred[type], (tmdbId, next) => {
    MetadataAdapter[method].call(MetadataAdapter, tmdbId)
      .then(metadata => {
        media.push(metadata)
        next(null)
      })
      .catch(next)
  }, (err) => done(err, media))
}

export const fetchStarred = () => (dispatch, getState) => {
  const state = getState()
  const { starred } = state.app.saved

  if (state.starred.isReady) {
    dispatch({ type: FETCHING })
  }

  if (starred.movies || starred.shows) {
    async.parallel({
      movies: (done) => get('movies', starred, done),
      shows: (done) => get('shows', starred, done)
    }, function (err, items) {
      //if (err) dispatch({ type: ERROR })
      dispatch({ type: FETCHED, items })
    })
  } else {
    dispatch({ type: EMPTY })
  }
}
