import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import dispatch from '../lib/dispatcher'

import { starredActions } from '../pages/Starred/redux'

@connect(
  state => ({ state: state.app }),
  { ...starredActions }
)
export default class StarredIcon extends Component {

  static defaultProps = {
    withText: true
  }

  constructor(props) {
    super(props)

    const type = props.data.type === 'show' ? 'shows' : 'movies'

    this.state = {
      type,
      active: props.state.saved.starred[type].includes(props.data.tmdb)
    }
  }

  action = (e) => {
    const {state, props} = this

    const action = state.active ? 'delStarred' : 'addStarred'

    dispatch(action, state.type, props.data.tmdb)

    e.preventDefault()

    if (action === 'delStarred') {
      this.props.onUnstar(state.type, props.data.tmdb)
    }

    this.setState({ active: !state.active })
  }

  render() {
    const {state, props} = this

    const buttonStarred = classNames('icon starred', {
      active: state.active
    })

    const starredText = props.withText ? state.active ? 'Stjernemærket' : 'Stjernemærk' : ''

    return props.type === 'button' ? (
      <button className={buttonStarred} onClick={this.action}>
        {starredText}
      </button>
    ) : (
      <a className={buttonStarred} onClick={this.action}>
        <span className="button-text">{starredText}</span>
      </a>
    )
  }

}
