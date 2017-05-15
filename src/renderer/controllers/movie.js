import React from 'react'
import async from 'async'

import {dispatch} from '../lib/dispatcher'

import {ContentSection} from '../components/items'
import MoviePage from '../pages/movie'
import MetaDataProvider from '../api/metadata'

export default class MovieController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      data: {},
      isMounted: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tmdb} = nextProps.match.params

    if (this.state.tmdb !== tmdb) {
      this.setState({
        isMounted: false,
        data: {}
      })
      this.setMovie(tmdb)
    }
  }

  componentDidMount() {
    this.setMovie(this.props.match.params.tmdb)
  }

  setMovie(tmdb) {
    async.parallel({
      movie: (done) => {
        MetaDataProvider.getMovieById(tmdb)
          .then(movie => {
            dispatch('setTitle', movie.title)
            done(null, movie)
          })
          .catch(done)
      },
      similar: (done) => {
        MetaDataProvider.getSimilarMovies(tmdb)
          .then(movies => done(null, movies))
          .catch(done)
      }
    }, (err, res) => {
      this.setState({
        data: {
          movie: res.movie,
          similar: res.similar
        },
        isMounted: true
      })
    })
  }

  render() {
    const {props, state} = this

    if (state.isMounted) {
      return (<MoviePage {...props} data={state.data} />)
    } else {
      return (<ContentSection>Some loading page here</ContentSection>)
    }
  }

}
