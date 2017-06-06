import React from 'react'
import async from 'async'

import HomePage from '../home'

import {
  ContentSection,
  Loader
} from '../../components/items'

import {dispatch} from '../../lib/dispatcher'
import MetadataAdapter from '../../api/metadata/adapter'

// Controls the Home page
export default class HomeController extends React.Component {

  initialState = {
    isMounted: false
  }

  constructor(props) {
    super(props)

    this.state = this.initialState
  }

  componentDidMount() {
    const {props} = this

    dispatch('setTitle', 'Home')

    async.parallel({
      popularMovies: function(done) {
        MetadataAdapter.getPopularMovies()
          .then(data => done(null, data))
          .catch(done)
      },
      topRatedMovies: function(done) {
        MetadataAdapter.getTopRatedMovies()
          .then(data => done(null, data))
          .catch(done)
      },
      popularShows: function(done) {
        MetadataAdapter.getPopularShows()
          .then(data => done(null, data))
          .catch(done)
      },
      topRatedShows: function(done) {
        MetadataAdapter.getTopRatedShows()
          .then(data => done(null, data))
          .catch(done)
      }
    }, (err, res) => {
      this.setState({
        isMounted: true,
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
    })
  }

  render() {
    const {props, state} = this

    return state.isMounted ? (
      <ContentSection>
        <HomePage {...props} media={state.media} />
      </ContentSection>
    ) : (
      <Loader spinner="dark" container="dark" top="250px" />
    )
  }

}