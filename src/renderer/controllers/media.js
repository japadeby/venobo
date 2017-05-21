import React from 'react'
import async from 'async'

import {dispatch} from '../lib/dispatcher'

import {ContentSection} from '../components/items'
import MediaPage from '../pages/media'
import MetadataAdapter from '../api/metadata/adapter'

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

    console.log(type)

    this.setData(tmdb, type)
  }

  setData(tmdb, type) {
    if (type === 'movie') {
      async.parallel({
        movie: (done) => {
          MetadataAdapter.getMovieById(tmdb)
            .then(movie => {
              dispatch('setTitle', movie.title)
              done(null, movie)
            })
            .catch(done)
        },
        similar: (done) => {
          MetadataAdapter.getSimilarMovies(tmdb)
            .then(movies => done(null, movies))
            .catch(done)
        },
        recommendations: (done) => {
          MetadataAdapter.getMovieRecommendations(tmdb)
            .then(movies => done(null, movies))
            .catch(done)
        }
      }, (err, res) => {
        console.log(res.movie)
        this.setState({
          data: {
            type: 'movie',
            media: res.movie,
            similar: res.similar,
            recommendations: res.recommendations
          },
          isMounted: true
        })
      })
    } else if (type === 'show') {

    } else {
      throw new Error('Invalid media type')
    }
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
