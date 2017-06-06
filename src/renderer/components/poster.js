import React from 'react'
import randomString from 'crypto-random-string'

import {dispatch} from '../lib/dispatcher'
import config from '../../config'

export default class Poster extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      items: []
    }
  }

  showTooltip = (e) => {
    const {tooltip} = this.props.state

    tooltip.poster = true

    const $front = $(e.target).closest('.react-item')
    const $frontPos = $front.offset()
    const $frontWidth = $front.outerWidth()

    const key = $front.data('tooltip')
    const data = this.props.items[key]

    data.style = {
      arrow: 70,
      class: '',
      position: {}
    }

    // tooltip is 300px wide
    const tooltipWidth = 300

    let tooltipPosLeft = parseFloat($frontPos.left + $frontWidth) + 10

    if (tooltipPosLeft + tooltipWidth > $(window).innerWidth()) {
      tooltipPosLeft -= $frontWidth + tooltipWidth
      data.style.class += 'left'
    }

    const tooltipPosTop = $frontPos.top - 30
    if (tooltipPosTop <= 25) {
      tooltipPosLeft -= 20
      data.style.class += ' menu-offset fixed-top'
    } else if (tooltipPosTop >= Math.abs($frontPos.top - $(window).height() + 30)) {
      tooltipPosLeft -= 20
      data.style.arrow = 300
      data.style.class += ' fixed-bottom'
    } else {
      data.style.position.top = `${tooltipPosTop}px`
    }

    data.style.position.left = `${tooltipPosLeft}px`

    data.pageLink = `/media/${data.type}/${data.tmdb}`

    tooltip.toggle(true, data)
  }

  hideTooltip = (e) => {
    const {tooltip} = this.props.state

    tooltip.poster = false

    tooltip.timeout = setTimeout(() => {
      tooltip.toggle()
    }, tooltip.delay)
  }

  componentDidMount() {
    const items = this.props.items.map((item, index) => {
      return (
        <div className="react-item movie" key={randomString(10)} data-tooltip={index}>
          <div className="front" onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip}>
            {item.poster ? (
              <div className="front-image" style={{backgroundImage: `url(${item.poster})`}}>
                <div className="backdrop medium">
                  <div className="react-play-button fill">
                    <figure className="icon-content" />
                  </div>
                </div>
              </div>
            ) : false}
          </div>
        </div>
      )
    })

    this.setState({items})
  }

  render () {
    return (
      <div>
        {this.state.items}
      </div>
    )
  }
}
