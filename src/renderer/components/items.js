import React from 'react'
import classNames from 'classnames'

import { NavLink } from 'react-router-dom'

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
