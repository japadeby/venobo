import React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import {dispatch} from '../lib/dispatcher'

export function Scaffold (props) {
  var styles = classNames('scaffold', props.classNames)
  return (
    <div className={styles}>
      {props.children}
    </div>
  )
}

export function CollectionHeader (props) {
  return (
    <header className='collection-header'>
      {props.children}
    </header>
  )
}

export function BlockCollection (props) {
  var styles = classNames('block collection portrait', props.classNames)
  return (
    <section className={styles}>
      {props.children}
    </section>
  )
}

export function HeaderButton (props) {
  return (
    <span onClick={props.click} className='see-all button'>{props.children}</span>
  )
}

export function ReactGrid (props) {
  var styles = classNames('react-grid', props.classNames)
  return (
    <div className={styles}>
      <span>
        {props.children}
      </span>
    </div>
  )
}

export class StarredButton extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      active: props.state.saved.starred.movies.includes(props.tmdb)
    }
  }

  setActive = () => {
    const {state, props} = this

    if (!state.active) {
      dispatch('addStarredMovie', props.tmdb)
    } else {
      dispatch('delStarredMovie', props.tmdb)
    }

    this.setState({
      active: !state.active
    })
  }

  render() {
    const {state, props} = this

    const buttonStarred = classNames('icon starred', {
      active: state.active
    })

    return (
      <button className={buttonStarred} onClick={this.setActive}>{state.active ? 'Stjernemærket' : 'Stjernemærk'}</button>
    )
  }

}
