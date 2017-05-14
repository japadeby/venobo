import React from 'react'

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

  componentWillMount() {
    const {state, props} = this
    const {metadata} = props.state

    if (state.isMounted) return

    MetaDataProvider.getMovieById(state.tmdb)
      .then(movie => {
        dispatch('setTitle', movie.title)

        this.setState({
          data: movie,
          isMounted: true
        })
      })
      .catch(console.warn)
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
