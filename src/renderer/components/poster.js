import React from 'react'
import {NavLink} from 'react-router-dom'

import {dispatch} from '../lib/dispatcher'

export default class Poster extends React.Component {

  constructor (props) {
    super(props)
  }

  showTooltip = (e) => {
    const {tooltip} = this.props.state

    if (!tooltip.enabled) {
      const $front = $(e.target).closest('.front')
      const $frontPos = $front.parent().offset()
      const $frontWidth = $front.width()

      const key = $front.data('tooltip')
      let data = this.props.items[key]

      data.style = {
        top: $frontPos.top,
        left: Math.abs($frontPos.top + $frontWidth) / 1.5
      }

      data.pageLink = `/movie/${data.tmdb}`

      tooltip.toggle(data)
    }
  }

  hideTooltip = (e) => {
    let target = e.target
    if (this.props.state.tooltip.enabled) {
      let timeout = setTimeout(() => {
        if(!document.querySelector('.tooltip').contains(target)) {
          //this.props.state.tooltip.toggle()
        } else {
          clearTimeout(timeout)
        }
      }, 700)
    }
  }

  componentWillMount () {
    let items = []

    for (let i in this.props.items) {
      let item = this.props.items[i]

      items.push(
        <div className="react-item movie" key={item._id}>
          <div className="front" data-tooltip={i} onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip}>
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
