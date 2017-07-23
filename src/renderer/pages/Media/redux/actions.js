import { FETCHED, PAGINATE, FETCHING } from './constants'

import async from 'async'

import MetadataAdapter from '../../../api/metadata/adapter'

export const paginate = ({ episodes, pagination, navigation }) => (dispatch, getState) => {
  if (pagination !== getState().media.pagination) {
    dispatch({
      type: PAGINATE,
      episodes,
      pagination,
      navigation
    })
  }
}

export const fetchData = (tmdb, type) => (dispatch, getState) => {
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
}
