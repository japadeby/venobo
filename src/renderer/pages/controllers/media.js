import React from 'react'
import async from 'async'

import {dispatch} from '../../lib/dispatcher'

import {
  ContentSection,
  Loader
} from '../../components/items'
import MediaPage from '../media'
import MetadataAdapter from '../../api/metadata/adapter'

export default class MediaController extends React.Component {

  initialState = {
    data: {},
    isMounted: false
  }

  constructor(props) {
    super(props)

    this.state = {
      ...this.initialState,
      tmdb: props.match.params.tmdb
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tmdb, type} = nextProps.match.params

    if (tmdb !== this.state.tmdb) {
      this.setState({
        ...this.initialState,
        tmdb
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
            .catch(done)
        }
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
      console.log(err, data)

      this.setState({
        data: {
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
      <Loader spinner="dark" container="dark" top="250px" />
    )
  }

}
