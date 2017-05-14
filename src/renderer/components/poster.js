import React from 'react'
import {NavLink} from 'react-router-dom'

import {dispatch} from '../lib/dispatcher'
import config from '../../config'

export default class Poster extends React.Component {

  constructor (props) {
    super(props)
  }

  showTooltip = (e) => {
    const {tooltip} = this.props.state

    tooltip.poster = true

    const $front = $(e.target).closest('.react-item')
    const $frontPos = $front.offset()
    const $frontWidth = $front.outerWidth()

    // tooltip is 300px wide
    const tooltipWidth = 300

    let posLeft = parseFloat($frontPos.left + $frontWidth) + 10
    let classNames = 'menu-offset'

    if (posLeft + tooltipWidth > $(window).outerWidth()) {
      posLeft -= $frontWidth + tooltipWidth
      classNames += ' left'
    }

    const key = $front.data('tooltip')
    let data = this.props.items[key]

    data.style = {
      arrow: 70,
      class: classNames,
      top: $frontPos.top - 30,
      left: posLeft
    }

    data.pageLink = `/movie/${data.tmdb}`

    tooltip.toggle(true, data)
  }

  hideTooltip = (e) => {
    const {tooltip} = this.props.state

    tooltip.poster = false

    tooltip.timeout = setTimeout(() => {
      tooltip.toggle()
    }, tooltip.delay)
  }

  componentWillMount() {
    let items = []

    for (let i in this.props.items) {
      let item = this.props.items[i]

      items.push(
        <div className="react-item movie" key={item.tmdb} data-tooltip={i}>
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
    }

    this.setState({items: items})
  }

  render () {
    return (
      <div>
        {this.state.items}
      </div>
    )
  }
}
