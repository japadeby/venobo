import React from 'react'
import classNames from 'classnames'
import debounce from 'debounce'

import {dispatch} from '../lib/dispatcher'

export default class PlayerPage extends React.Component {

  initialState = {
    uiShown: true,
    isTest: false,
    isDragging: false,
    scrubbingLabel: null,
    showAudioMenu: false
  }

  videoStyle = {
    position: 'absolute',
    top: '0px',
    zIndex: '0',
    width: '100%',
    height: '100%'
  }

  videoPlayerStyle = {
    backgroundColor: 'rgb(0,0,0)',
    position: 'relative',
    height: 'inherit',
    width: 'inherit'
  }

  duration: Number
  mediaTag: Object

  constructor(props) {
    super(props)

    this.debounceHideUi = debounce(this.hideUi, 3000)

    var {
      isFullScreen,
      isPaused,
      duration,
      currentTime,
      seekerFraction,
      videoSeekerPercentage,
      volume
    } = props.state.playing

    this.duration = duration

    const hasFinishedWatching = currentTime === duration
    currentTime = hasFinishedWatching ? 0 : duration - currentTime
    videoSeekerPercentage = seekerFraction && !hasFinishedWatching ? 100 * seekerFraction / duration : 0
    const timeLeft = hasFinishedWatching ? duration : currentTime

    this.state = {
      isMuted: volume === 0,
      isMounted: props.isMounted,
      isLoading: !props.isMounted,
      isFullScreen: props.state.window.isFullScreen,
      isPaused,
      videoSeekerPercentage,
      timeLeft,
      currentTime,
      ...this.initialState
    }
  }

  componentDidMount() {
    const {props, state} = this
    const {playing} = props.state
    const $seeker = $(this.refs.seekSlider)

    const mediaTag = this.mediaTag = $(this.refs.video).get(0)
    dispatch('setMediaTag', mediaTag)

    if (playing.isPaused && !mediaTag.paused) {
      mediaTag.pause()
    } else if (!playing.isPaused && mediaTag.paused) {
      mediaTag.play()
    }

    if (!playing.seekerPos) playing.seekerPos = $seeker.position().left //$(this.refs.seekHandle).position().left

    // If media has already been played, start from where we left off
    if (playing.currentTime !== 0) mediaTag.currentTime = playing.currentTime

    this.videoSeekerInterval = setInterval(this.videoSeeker, 1000)

    // event listeners
    $(window).on('keypress', this.onKeyPress)
  }

  componentWillUnmount() {
    $(window).off('keypress', this.onKeyPress)
    clearInterval(this.videoSeekerInterval)
  }

  onKeyPress = (e) => {
    // Play (unpause) on space key event
    if (e.keyCode === 0 || e.keyCode === 32) {
      this.playPause()
    }
    e.preventDefault()
    return false
  }

  isDisabledStyle = (classes) => {
    return classNames(classes, {
      disabled: !this.state.isMounted
    })
  }

  showAudioMenu = (e) => {
    if (!this.state.isMounted) return

    this.setState({ showAudioMenu: true })
  }

  hideAudioMenu = (e) => {
    this.setState({ showAudioMenu: false })
  }

  handleVolumeWheel = (e) => {
    dispatch('changeVolume', (-e.deltaY | e.deltaX) / 500)
  }

  mediaMouseMoved = (e) => {
    const {isMounted, isTest, uiShown} = this.state

    if (isMounted && !isTest) {
      if (!uiShown) this.setState({ uiShown: true })
      this.debounceHideUi()
    }
  }

  hideUi = () => {
    const {uiShown, isPaused, isDragging} = this.state
    if (!uiShown && !isPaused || isDragging) return

    this.setState({
      uiShown: false,
      showAudioMenu: false
    })
  }

  calculateVideoSeekerPos = (e) => {
    const {playing} = this.props.state

    const $seeker = $(this.refs.seekSlider)
    const seekerWidth = $seeker.outerWidth()
    const seekerPos = $seeker.position().left

    const horizontalAxis = typeof e === 'number' ? e : e.clientX
    playing.seekerPos = horizontalAxis

    const fraction = Math.abs(horizontalAxis - seekerPos) / seekerWidth
    const position = fraction * this.duration

    playing.seekerFraction = position

    return {
      fraction,
      position
    }
  }

  isVideoSeekerStartOrEnd(e) {
    const $seeker = $(this.refs.seekSlider)
    const seekerWidth = $seeker.outerWidth()
    const seekerPos = $seeker.position().left

    const isSeekerStart = e.clientX <= seekerPos
    const isSeekerEnd = e.clientX >= seekerWidth + seekerPos

    return !e.clientX || isSeekerStart || isSeekerEnd
  }

  handleVideoScrub = (e) => {
    const {position} = this.calculateVideoSeekerPos(e)

    this.setState({
      timeLeft: this.duration - position,
      isDragging: false,
      scrubbingLabel: null,
      videoSeekerPercentage: 100 * position / this.duration
    })
    dispatch('skipTo', position)
  }

  handleDragStart = (e) => {
    // Prevent the cursor from changing, eg to a green + icon on Mac
    // And prevent a ghost image of the handle to appear
    const dt = e.dataTransfer
    if (dt) this.setFakeDragIcon(dt)
  }

  /**
  * Solution to remove the ghost image when dragging
  * @author <https://stackoverflow.com/a/19601254/7933677>
  */
  setFakeDragIcon = (dt) => {
    const dragIcon = document.createElement('img')
    dragIcon.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAAL‌​AAAAAABAAEAAAIBRAA7"

    dt.setDragImage(dragIcon, -99999, -99999)
    dt.effectAllowed = 'none'
  }

  handleVideoSeeker = (e) => {
    if (this.isVideoSeekerStartOrEnd(e)) return

    const {position} = this.calculateVideoSeekerPos(e)

    this.setState({
      isDragging: true,
      scrubbingLabel: this.scrubbingLabel(position),
      videoSeekerPercentage: 100 * position / this.duration
    })
  }

  videoSeeker = () => {
    const {props, state, mediaTag} = this
    const {playing} = props.state

    if (playing.isPaused && !mediaTag.paused) {
      mediaTag.pause()
    } else if (!playing.isPaused && mediaTag.paused) {
      mediaTag.play()
    }

    if (!playing.isPaused) {
      const hasFinished = playing.currentTime >= this.duration
      if (!hasFinished) {
        const currentTime = playing.currentTime++
        const timeLeft = this.duration - currentTime

        const calculateSecondToPercentage = $(this.refs.seekSlider).outerWidth() / this.duration
        const {position} = this.calculateVideoSeekerPos(playing.seekerPos + calculateSecondToPercentage)

        const newState = { timeLeft }

        //if (state.uiShown) {
          if (!state.isDragging) {
            newState.videoSeekerPercentage = 100 * position / this.duration
          }
          this.setState(newState)
        //}
      } else {
        playing.isPaused = true
        this.setState({
          uiShown: true,
          isPaused: true
        })
      }
    }
  }

  scrubbingLabel(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
  }

  playPause = (e) => {
    const {state, props, mediaTag} = this
    const {playing} = props.state

    if (!state.isMounted) return

    const newState = {
      isPaused: !playing.isPaused
    }

    if (!state.isPaused) newState.uiShown = true

    if (playing.currentTime >= this.duration) {
      playing.seekerPos = $(this.refs.seekSlider).position().left
      playing.currentTime = 0
      playing.videoSeekerPercentage = 0
      mediaTag.currentTime = 0

      newState.currentTime = 0
      newState.timeLeft = this.duration
      newState.videoSeekerPercentage = 0
    }

    this.setState(newState)
    dispatch('playPause')
  }

  toggleFullScreen = (e) => {
    const {state, props} = this
    if (!state.isMounted) return

    this.setState({ isFullScreen: !props.state.window.isFullScreen })
    dispatch('toggleFullScreen')
  }

  isMutedStyle = (classes) => {
    return classNames(classes, { muted: this.state.isMuted })
  }

  render() {
    const {
      isLoading,
      duration,
      uiShown,
      videoSeekerPercentage,
      isDragging,
      scrubbingLabel,
      isPaused,
      isFullScreen,
      timeLeft,
      showAudioMenu
    } = this.state
    const {isDisabledStyle, props, isMutedStyle} = this
    const {media} = props
    const {location} = props.state.playing

    const showVideo = location !== 'local'
    const showControls = location !== 'external'
    const fullScreenBtn = isFullScreen ? 'no-fullscreen' : 'fullscreen'
    const isPausedBtn = isPaused ? 'play' : 'pause'

    return (
      <div ref="videoPlayer" style={this.videoPlayerStyle} onWheel={this.handleVolumeWheel} onMouseMove={this.mediaMouseMoved}>
        <video ref="video" style={this.videoStyle} src="https://static.videezy.com/system/resources/previews/000/002/180/original/Bee-is-collecting-honey.mp4">
        </video>
        <div className="vask-container">
          <div className="content-wrapper">
              {isLoading &&
                <div className="curtain">
                  <div className="product-image" style={{backgroundImage: "url(https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/306/852/1480085375-1a7421d29517b24486a64619e05f76ea581aa5f6.jpg?width=1280)"}}>
                    <div id="vp-spinner-sheet-container">
                      <div className="sheet-container"></div>
                    </div>
                  </div>
                </div>
              }
              <div className="scene" className={classNames('scene', {hide: !uiShown})}>
                <div className="backdrop"></div>
                <div className="top-ui">
                  <div className="ui-cell control-btn browser-back">
                    <button className="browser-back" onClick={() => dispatch('back')}></button>
                  </div>
                </div>
                <div className="bottom-ui">
                  <div className="metadata movie">
                    <div className="ui-cell image" style={{backgroundImage: `url(${media.poster})`}}></div>
                    <div className="text">
                      <div className="text-container">
                        <h1 className="title">{media.title}</h1>
                        <p className="synopsis">{media.summary}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ui-row playback-controls">
                    <div className={classNames('ui-cell control-btn', isPausedBtn)}>
                      <button className={isDisabledStyle(isPausedBtn)} onClick={this.playPause}></button>
                    </div>
                    <div className="ui-cell timeline">
                      <div className="timeline-mask">
                        <div ref="seekSlider" onClick={this.handleVideoScrub} className={isDisabledStyle('slider horizontal')}>
                          <div className="primary" style={{width: `${videoSeekerPercentage}%`}}></div>
                          <button ref="seekHandle" className="target-btn" style={{left: `${videoSeekerPercentage}%`}}>
                            <div className="handle"
                              draggable="true"
                              onDragStart={this.handleDragStart}
                              onDrag={this.handleVideoSeeker}
                              onDragEnd={this.handleVideoScrub} />
                          </button>
                        </div>
                        <div className={classNames('timeline-tooltip vod', {scrubbing: isDragging})} style={{left: `${videoSeekerPercentage}%`}}>{/*scrubbing*/}
                          <label className="ui-cell time-label">{scrubbingLabel}</label>
                        </div>
                      </div>
                    </div>
                    <label className="ui-cell time-label">{this.scrubbingLabel(timeLeft)}</label>
                    <div className="ui-cell control-btn language subtitlesAvailable">
                      <button ref="subtitles" className={isDisabledStyle('language subtitlesAvailable')}></button>
                    </div>
                    <div className={isMutedStyle('ui-cell control-btn audio-control')}>
                      {showAudioMenu &&
                        <span ref="audioSlider">
                          <div className="audio-slider" onMouseLeave={this.hideAudioMenu}>
                            <div className="slider vertical" onClick={this.handleAudioScrub}>
                              <div className="primary" style={{height: `${audioSliderPercentage}%`}}>
                                <button className="target-btn" style={{bottom: `${audioSliderPercentage}%`}}>
                                  <div className="handle"
                                    draggable="true"
                                    onDragStart={this.handleDragStart}
                                    onDrag={this.handleAudioSeeker}
                                    onDragEnd={this.handleAudioScrub} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </span>
                      }
                      <button ref="audioBtn" onClick={this.muteUnmute} onMouseEnter={this.showAudioMenu} className={isDisabledStyle(isMutedStyle('audio-control'))}></button>
                    </div>
                    <div className="ui-cell control-btn quality auto highest">
                      <button ref="cast" className={isDisabledStyle('quality auto highest')}></button>
                    </div>
                    <div className={classNames('ui-cell control-btn', fullScreenBtn)}>
                      <button onClick={this.toggleFullScreen} className={isDisabledStyle(fullScreenBtn)}></button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    )
  }

}

function _(e) {
  return document.querySelector(e)
}
