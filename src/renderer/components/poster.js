import React from 'react'
import {NavLink} from 'react-router-dom'

import {dispatch} from '../lib/dispatcher'

export default class Poster extends React.Component {

  constructor (props) {
    super(props)
  }

  showTooltip = (e) => {
    const {tooltip} = this.props.state

    tooltip.poster = true
    //if (!tooltip.enabled) {
      const $front = $(e.target).closest('.react-item')
      const $frontPos = $front.offset()
      const $frontWidth = $front.outerWidth()

      const key = $front.data('tooltip')
      let data = this.props.items[key]

      data.style = {
        top: $frontPos.top,
        left: parseFloat($frontPos.left + $frontWidth)
      }

      data.pageLink = `/movie/${data.tmdb}`

      tooltip.toggle(true, data)
    //}
  }

  hideTooltip = (e) => {
    const {tooltip} = this.props.state

    tooltip.poster = false

    tooltip.timeout = setTimeout(() => {
      this.props.state.tooltip.toggle()
    }, tooltip.delay)
  }

  componentWillMount() {
    let items = []

    for (let i in this.props.items) {
      let item = this.props.items[i]

      items.push(
        <div className="react-item movie" key={item._id} data-tooltip={i}>
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
