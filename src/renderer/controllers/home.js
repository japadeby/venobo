import {ipcRenderer} from 'electron'
import React from 'react'
import async from 'async'

import HomePage from '../pages/home'

import {ContentSection} from '../components/items'

import HTTP from '../utils/http'
import {dispatch} from '../lib/dispatcher'
import config from '../../config'
import MetaDataProvider from '../api/metadata'

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
      popular: function(done) {
        MetaDataProvider.getPopularMovies()
          .then(data => done(null, data))
          .catch(done)
      },
      topRated: function(done) {
        MetaDataProvider.getTopRatedMovies()
          .then(data => done(null, data))
          .catch(done)
      }
    }, (err, res) => {
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
