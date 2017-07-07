import async from 'async'

import MetadataAdapter from '../../../api/metadata/adapter'
import { FETCHED, ERROR } from './constants'

export function fetchMedia() {
  return (dispatch, getState) => {
    async.parallel({
      popularMovies: (done) => {
        MetadataAdapter.getPopularMovies()
          .then(data => done(null, data))
          .catch(done)
      },
      topRatedMovies: (done) => {
        MetadataAdapter.getTopRatedMovies()
          .then(data => done(null, data))
          .catch(done)
      },
      popularShows: (done) => {
        MetadataAdapter.getPopularShows()
          .then(data => done(null, data))
          .catch(done)
      },
      topRatedShows: (done) => {
        MetadataAdapter.getTopRatedShows()
          .then(data => done(null, data))
          .catch(done)
      }
    }, (err, res) => {
      if (err) {
        dispatch({ type: ERROR, payload: err })
      } else {
        dispatch({
          type: FETCHED,
          media: {
            movies: {
              popular: res.popularMovies,
              topRated: res.topRatedMovies
            },
            shows: {
              popular: res.popularShows,
              topRated: res.topRatedShows
            }
          }
        })
      }
  }
}
