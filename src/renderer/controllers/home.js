import React from 'react'
import async from 'async'

import HomePage from '../pages/home'

import {ContentSection} from '../components/items'

import {dispatch} from '../lib/dispatcher'
import MetadataAdapter from '../api/metadata/adapter'
import TorrentAdapter from '../api/torrents/adapter'

// Controls the Home page
export default class HomeController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isMounted: false
    }
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
      console.log(res.topRatedShows)
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
      <ContentSection>Some loading page</ContentSection>
    )
  }

}
