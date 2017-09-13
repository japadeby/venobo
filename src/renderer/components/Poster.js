import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
//import randomString from 'crypto-random-string'

import { tooltipActions } from './Tooltip/redux'
import config from '../../config'

@connect(
  state => ({ tooltip: state.tooltip }),
  { ...tooltipActions }
)
export default class Poster extends Component {

  state = {
    items: []
  }

  componentWillMount() {
    if (this.state.items.length === 0) {
      const items = this.props.items.map((item, index) => {
        return (
          <div className="react-item movie" key={index} data-tooltip={index}>
            <div className="front" onMouseEnter={this.showTooltip} onMouseLeave={this.props.dismissTooltipDelay}>
              {item.poster &&
                <div className="front-image" style={{backgroundImage: `url(${item.poster})`}}>
                  <div className="backdrop medium">
                    <div className="react-play-button fill">
                      <figure className="icon-content" />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        )
      })

      this.setState({ items })
    }
  }

  showTooltip = (e) => {
    if (!this.props.tooltip.enabled) {
      const $front = $(e.target).closest('.react-item')
      const $frontPos = $front.offset()
      const $frontWidth = $front.outerWidth()

      console.log($frontPos, $frontWidth)

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

      this.props.toggleTooltip(data)
    }
  }

  render() {
    return (
      <div>
        {this.props.items.map((item, index) => (
          <div className="react-item movie" key={index} data-tooltip={index}>
            <div className="front" onMouseEnter={this.showTooltip} onMouseLeave={this.props.dismissTooltipDelay}>
              <Link to={`/media/${item.type}/${item.tmdb}`}>
                {item.poster &&
                  <div className="front-image" style={{backgroundImage: `url(${item.poster})`}}>
                    <div className="backdrop medium">
                      <div className="react-play-button fill">
                        <figure className="icon-content" />
                      </div>
                    </div>
                  </div>
                }
              </Link>
            </div>
          </div>
        ))}
      </div>
    )
  }

}
