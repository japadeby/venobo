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

    TorrentAdapter('tt0460681', 'shows', {search: 'Supernatural', season: 11, episode: 1})
      .then(console.log)
      .catch(console.log)

    dispatch('setTitle', 'Home')

    async.parallel({
      popular: function(done) {
        MetadataAdapter.getPopularMovies()
          .then(data => done(null, data))
          .catch(done)
      },
      topRated: function(done) {
        MetadataAdapter.getTopRatedMovies()
          .then(data => done(null, data))
          .catch(done)
      }
    }, (err, res) => {
      console.log(res)
      this.setState({
        isMounted: true,
        media: {
          movies: {
            popular: res.popular,
            topRated: res.topRated
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
