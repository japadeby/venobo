import * as media from './constants'

import async from 'async'

import MetadataAdapter from '../../../api/metadata/adapter'

const create = (action, data = {}) => ({ ...data, type: media[action] })

export const paginate = ({ episodes, pagination, navigation }) => (
  create('PAGINATE', { episodes, pagination, navigation })
)

export const fetch = (tmdb, type) => create('FETCHING', { tmdb, type, meta: { thunk: true } })
export const fetchFail = (error, meta) => create('FETCH_ERROR', { error, meta })
export const fetchSuccess = (payload, meta) => create('FETCHED', { payload, meta })

/*export const fetch = (tmdb, type) => (dispatch, getState) => {
  if (getState().media.isReady) {
    dispatch({ type: FETCHING })
  }

  const method = type === 'movie'
    ? 'getMovieById'
    : 'getShowById'

  async.parallel({
    media: (done) => {
      MetadataAdapter[method].call(MetadataAdapter, tmdb)
        .then(media => {
          //let dispatcher = require('../../../lib/dispatcher')

          //dispatcher('setTitle', media.title)
          done(null, media)
        })
        .catch(done)
    },
    similar: (done) => {
      MetadataAdapter.getSimilar(type, tmdb)
        .then(media => done(null, media))
        .catch(done)
    },
    recommended: (done) => {
      MetadataAdapter.getRecommendations(type, tmdb)
        .then(media => done(null, media))
        .catch(done)
    }
  }, (err, data) => {
    console.log(err)
    dispatch({ type: FETCHED, data, err })
  })
}*/
