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
      tmdb: props.match.params.tmdb,
      isMounted: false
    }
  }


  shouldComponentUpdate(update) {
    console.log(update)
    return true
  }

  componentWillMount() {
    const {state, props} = this

    if (state.isMounted) return

    async.parallel({
      movie: function(done) {
        MetaDataProvider.getMovieById(state.tmdb)
          .then(movie => {
            dispatch('setTitle', movie.title)
            done(null, movie)
          })
          .catch(done)
      },
      similar: function(done) {
        MetaDataProvider.getSimilarMovies(state.tmdb)
          .then(movies => done(null, movies))
          .catch(done)
      }
    }, (err, res) => {
      console.log(err)
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
