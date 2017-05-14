import React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import {dispatch} from '../lib/dispatcher'

export function ContentStarred (props) {
  return (
    <div id="content" className={classNames('starred', props.classNames)}>
      <div className="dockable" />
      {props.children}
    </div>
  )
}

export function ContentSection (props) {
  return (
    <div id="content" className="section">
      <div className="dockable" />
      {props.children}
    </div>
  )
}

export function ContentProduct (props) {
  return (
    <div id="content" className="product">
      <div className="dockable" />
      {props.children}
    </div>
  )
}

export function MovieProduct (props) {
  return (
    <section className="block product movie">
      {props.children}
    </section>
  )
}

export function PlayerWrapper (props) {
  return (
    <div className="block-product">
      <Scaffold>
        <div className="player-wrapper">
          <div className="react-play-button large" onClick={props.onClick}>
            <figure className="icon-content"></figure>
          </div>
        </div>
      </Scaffold>
    </div>
  )
}

export function Hero (props) {
  var styles = classNames('hero', props.classNames)
  return (
    <section className={styles}>
      {props.children}
    </section>
  )
}

export function HeroWrapper (props) {
  return (
    <div className="hero-wrapper">
      {props.children}
    </div>
  )
}

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
  var styles = classNames('block collection', props.classNames)
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

export class StarredIcon extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      active: props.state.saved.starred.movies.includes(props.tmdb)
    }
  }

  action = (e) => {
    const {state, props} = this

    if (!state.active) {
      dispatch('addStarredMovie', props.tmdb)
    } else {
      dispatch('delStarredMovie', props.tmdb)
    }

    e.preventDefault()

    this.setState({
      active: !state.active
    })
  }

  render() {
    const {state, props} = this

    const buttonStarred = classNames('icon starred', {
      active: state.active
    })

    return props.type === 'button' ? (
      <button className={buttonStarred} onClick={this.action}>
        {state.active ? 'Stjernemærket' : 'Stjernemærk'}
      </button>
    ) : (
      <a className={buttonStarred} onClick={this.action}>
        <span className="button-text">{state.active ? 'Stjernemærket' : 'Stjernemærk'}</span>
      </a>
    )
  }

}
