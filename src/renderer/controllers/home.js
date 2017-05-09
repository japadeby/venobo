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
    //props.state.window.title = 'Home'
    ipcRenderer.send('setAllowNav', false)

    HTTP.get(`${config.APP.API}/movies/sort/latest`, (data) => {
      for(let i in data) {
        data[i].poster = `${config.TMDB.POSTER}${data[i].poster}`
      }

      dispatch('setTitle', 'Home')

      this.setState({
        isMounted: true,
        media: {
          movies: data
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
      return (<HomePage {...props} media={state.media} />)
    } else {
      return (<div>Some loading content here</div>)
    }
  }

}
