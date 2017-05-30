import React from 'react'
import async from 'async'

import {dispatch} from '../../lib/dispatcher'

import {ContentSection} from '../../components/items'
import MediaPage from '../media'
import MetadataAdapter from '../../api/metadata/adapter'

export default class MediaController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      data: {},
      isMounted: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tmdb, type} = nextProps.match.params

    if (tmdb !== this.state.tmdb) {
      this.setState({
        isMounted: false,
        data: {}
      })
      this.setData(tmdb, type)
    }
  }

  componentDidMount() {
    const {tmdb, type} = this.props.match.params

    this.setData(tmdb, type)
  }

  setData(tmdb, type) {
    async.parallel({
      media: (done) => {
        /*MetadataAdapter.getMediaById(type, tmdb)
          .then(media => {
            dispatch('setTitle', media.title)
            done(null, media)
          })
          .catch(done)*/
        if (type === 'movie') {
          MetadataAdapter.getMovieById(tmdb)
            .then(movie => {
              dispatch('setTitle', movie.title)
              done(null, movie)
            })
            .catch(done)
        } else if (type === 'show') {
          MetadataAdapter.getShowById(tmdb)
            .then(show => {
              dispatch('setTitle', show.title)
              done(null, show)
            })
            .catch(err => done('media: ' + err))
        }
      },
      similar: (done) => {
        MetadataAdapter.getSimilar(type, tmdb)
          .then(media => done(null, media))
          .catch(done)
        /*if (type === 'movie') {
          MetadataAdapter.getSimilarMovies(tmdb)
            .then(movies => done(null, movies))
            .catch(() => done())
        } else if (type === 'show') {
          MetadataAdapter.getSimilarShows(tmdb)
            .then(shows => done(null, shows))
            .catch(() => done())
        }*/
      },
      recommended: (done) => {
        MetadataAdapter.getRecommendations(type, tmdb)
          .then(media => done(null, media))
          .catch(done)
        /*if (type === 'movie') {
          MetadataAdapter.getMovieRecommendations(tmdb)
            .then(movies => done(null, movies))
            .catch(done)
        } else if (type === 'show') {
          MetadataAdapter.getShowRecommendations(tmdb)
            .then(shows => done(null, shows))
            .catch(err => done('recommended: ' + err))
        }*/
      }
    }, (err, data) => {
      console.log(err, data)

      this.setState({
        data: {
          type: type,
          media: data.media,
          similar: data.similar,
          recommended: data.recommended
        },
        isMounted: true
      })
    })
  }

  render() {
    const {props, state} = this

    return state.isMounted ? (
      <MediaPage {...props} data={state.data} />
    ) : (
      <ContentSection>Some loading page here</ContentSection>
    )
  }

}
