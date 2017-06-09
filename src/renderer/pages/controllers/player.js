import React from 'react'
import classNames from 'classnames'
import debounce from 'debounce'

import {dispatch} from '../../lib/dispatcher'
import PlayerPage from '../player'

export default class PlayerController extends React.Component {

  initialState = {
    isReady: false
  }

  constructor(props) {
    super(props)

    var {tmdb, type} = props.match.params

    type = type === 'show'
      ? 'shows'
      : 'movies'

    this.state = {
      ...this.initialState,
      media: props.state.media[type][tmdb]
    }
  }

  componentWillMount() {
    const {media} = this.state

    if (media) {
      this.setState({
        isReady: true
      })
    } else {
      dispatch('back')
    }
  }

  render() {
    const {state, props} = this
    const {media, isReady} = state

    return (
      <PlayerPage key={isReady} {...props} media={media} isMounted={isReady} />
    )
  }

}
