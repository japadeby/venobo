import React from 'react'
import classNames from 'classnames'
import debounce from 'debounce'
import {ipcRenderer} from 'electron'

import {dispatch} from '../../lib/dispatcher'
import PlayerPage from '../player'

export default class PlayerController extends React.Component {

  initialState = {
    isReady: false,
    mediaUrl: '',
    posterPath: undefined
  }

  constructor(props) {
    super(props)

    var {tmdb, type, quality} = props.match.params

    type = type === 'show'
      ? 'shows'
      : 'movies'

    this.state = {
      ...this.initialState,
      quality,
      tmdb,
      type,
      media: props.state.media[type][tmdb]
    }
  }

  componentWillMount() {
    const {media} = this.state

    if (media) {
      //this.setState({ isReady: true })
    } else {
      dispatch('back')
    }
  }

  componentDidMount() {
    const {state} = this.props
    const {media, quality} = this.state

    dispatch('addTorrent', media.torrents[quality].magnet)

    ipcRenderer.on('wt-server-running', () => {
      state.playing.isPaused = false
      this.setState({
        mediaUrl: state.server.localURL + '/1',
        isReady: true
      })
    })

    /*ipcRenderer.on('wt-poster', (torrentKey, posterFileName) => {
      this.setState({
        posterPath: posterFileName
      })
    })*/
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    dispatch('closePlayer')
  }

  render() {
    const {state, props} = this
    const {media, isReady, mediaUrl, posterPath} = state

    return (
      <PlayerPage key={isReady} {...props} media={media} isReady={isReady} mediaUrl={mediaUrl} poster={posterPath} />
    )
  }

}
