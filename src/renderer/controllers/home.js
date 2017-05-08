import {ipcRenderer} from 'electron'
import React from 'react'

import HomePage from '../pages/home'

import HTTP from '../utils/http'
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
    props.state.window.title = 'Home'
    ipcRenderer.send('setAllowNav', false)

    HTTP.get(`${config.APP.API}/movies/sort/latest`, (data) => {
      var latestMovies = []

      for(let i in data) {
        latestMovies.push({poster: `${config.TMDB.POSTER}${data[i].poster}`})
      }

      this.setState({
        isMounted: true,
        media: {
          movies: latestMovies
        }
      })
    })
  }

  componentWillUnmount() {
    ipcRenderer.send('setAllowNav', true)
  }

  render() {
    const {props, state} = this

    if (state.isMounted) {
      return (<HomePage state={props.state} media={state.media} />)
    } else {
      return (<div>Some loading content here</div>)
    }
  }

}
