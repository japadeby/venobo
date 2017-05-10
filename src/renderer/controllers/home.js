import {ipcRenderer} from 'electron'
import React from 'react'

import HomePage from '../pages/home'

import HTTP from '../utils/http'
import {dispatch} from '../lib/dispatcher'
import config from '../../config'

// Controls the Home page
export default class HomeController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isMounted: false
    }
  }

  componentWillMount() {
    const {state, props} = this

    if (state.isMounted) return

    // initialize preferences
    HTTP.get(`${config.APP.API}/movies/sort/latest`, (movies) => {
      for(let i in movies) {
        movies[i].poster = `${config.TMDB.POSTER}${movies[i].poster}`
        HTTP.get(`${config.TMDB.API}/movie/${movies[i].tmdb}?api_key=${config.TMDB.KEY}&language=${props.state.saved.prefs.iso4}`, (data) => {
          movies[i].title = data.title
          movies[i].runtime = `${data.runtime}min`
          movies[i].summary = data.overview
        })
      }

      dispatch('setTitle', 'Home')

      this.setState({
        isMounted: true,
        media: {
          movies: movies
        }
      })
    })
  }

  render() {
    const {props, state} = this

    if (state.isMounted) {
      return (<HomePage {...props} media={state.media} />)
    } else {
      return (<div>Some loading content here</div>)
    }
  }

}
