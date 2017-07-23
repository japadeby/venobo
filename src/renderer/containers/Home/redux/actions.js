import async from 'async'

import MetadataAdapter from '../../../api/metadata/adapter'
import { FETCHED, ERROR } from './constants'

export function fetchMedia() {
  console.log('fetchMedia')
  return (dispatch, getState) => {
    async.parallel({
      popularMovies: (done) => {
        MetadataAdapter.getPopular('movies')
          .then(data => done(null, data))
          .catch(done)
      },
      topRatedMovies: (done) => {
        MetadataAdapter.getTopRated('movies')
          .then(data => done(null, data))
          .catch(done)
      },
      popularShows: (done) => {
        MetadataAdapter.getPopular('shows')
          .then(data => done(null, data))
          .catch(done)
      },
      topRatedShows: (done) => {
        MetadataAdapter.getTopRated('shows')
          .then(data => done(null, data))
          .catch(done)
      }
    }, (error, res) => {
      if (error) {
        dispatch({ type: ERROR, error })
      } else {
        dispatch({
          type: FETCHED,
          payload: {
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
    })
  }
}
