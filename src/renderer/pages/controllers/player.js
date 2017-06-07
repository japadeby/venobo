import React from 'react'
import classNames from 'classnames'

import {dispatch} from '../../lib/dispatcher'

export default class PlayerController extends React.Component  {

  initialState = {
    isMounted: false,
    timeLabel: '00:00:01'
  }

  videoStyle = {
    position: 'absolute',
    top: '0px',
    zIndex: '0',
    width: '100%',
    height: '100%'
  }

  constructor(props) {
    super(props)

    var {type, tmdb} = props.match.params
    type = type === 'show' ? 'shows' : 'movies'

    this.state = {
      ...this.initialState,
      tmdb,
      type,
      media: props.state.media[type][tmdb]
    }
  }

  componentWillMount() {
    const {media} = this.state

    if (media) {
      console.log('in state')
    } else {
      dispatch('back')
    }
  }

  componentDidMount() {

  }

  createStyle = (classes) => {
    return classNames(classes, {
      disabled: !this.state.isMounted
    })
  }

  videoPlayerStyle() {
    return {
      backgroundColor: 'rgb(0,0,0)',
      position: 'relative',
      height: $(window).height(),
      width: $(window).width()
    }
  }

  render() {
    const {isMounted, timeLabel, media} = this.state
    const {createStyle} = this

    return (
      <div id="videoPlayer" style={this.videoPlayerStyle()}>
        <video style={this.videoStyle} src="https://static.videezy.com/system/resources/previews/000/002/180/original/Bee-is-collecting-honey.mp4">
        </video>
        <div className="vask-container">
          <div className="content-wrapper">
              <div className="curtain">
                <div className="product-image" style={{backgroundImage: "url(https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/306/852/1480085375-1a7421d29517b24486a64619e05f76ea581aa5f6.jpg?width=1280)"}}>
                  <div id="vp-spinner-sheet-container">
                    <div className="sheet-container"></div>
                  </div>
                </div>
              </div>
              <div className="scene">
                <div className="backdrop"></div>
                <div className="top-ui">
                  <div className="ui-cell control-btn browser-back">
                    <button className="browser-back"></button>
                  </div>
                </div>
                <div className="bottom-ui">
                  <div className="metadata movie">
                    <div className="ui-cell image" style={{backgroundImage: `url(${media.poster})`}}></div>
                    <div className="text">
                      <div className="text-container">
                        <h1 className="title" style={{display: 'block'}}>{media.title}</h1>
                      </div>
                    </div>
                  </div>
                  <div className="ui-row playback-controls">
                    <div className="ui-cell control-btn play">
                      <button className={createStyle('play')}></button>
                    </div>
                    <div className="ui-cell timeline">
                      <div className="timeline mask">
                        <div className={createStyle('slider horizontal')}>
                          <div className="primary" style={{width: '0%'}}></div>
                          <button className="target-btn" style={{left: '0%'}}>
                            <div className="handle"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <label className="ui-cell time-label">{timeLabel}</label>
                    <div className="ui-cell control-btn language subtitlesAvailable">
                      <button className={createStyle('language subtitlesAvailable')}></button>
                    </div>
                    <div className="ui-cell quality auto highest">
                      <button className={createStyle('quality auto highest')}></button>
                    </div>
                    <div className="ui-cell control-btn fullscreen">
                      <button className={createStyle('fullscreen')}></button>
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
