import React from 'react'
import classNames from 'classnames'

import {dispatch} from '../lib/dispatcher'
import Footer from './footer'

export function SectionMenu (props) {
  return (
    <secton className="block section-menu active">
      {props.children}
    </secton>
  )
}

export function SectionWrapper (props) {
  return (
    <div className="section-wrapper">
      {props.children}
    </div>
  )
}

function Content (props) {
  return (
    <div id="content" className={props.classNames}>
      {props.children}
      <Footer state={props.state} />
    </div>
  )
}

export function ContentCategory (props) {
  return (
    <Content classNames={classNames('category', props.classNames)}>
      {props.children}
    </Content>
  )
}

export function ContentStarred (props) {
  return (
    <Content classNames={classNames('starred', props.classNames)}>
      {props.children}
    </Content>
  )
}

export function ContentSection (props) {
  return (
    <Content classNames="section">
      {props.children}
    </Content>
  )
}

export function ContentProduct (props) {
  return (
    <Content classNames="product">
      {props.children}
    </Content>
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
  return (
    <div className={classNames('scaffold', props.classNames)}>
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
  return (
    <section className={classNames('block collection', props.classNames)}>
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
  return (
    <div className={classNames('react-grid', props.classNames)}>
      <span>
        {props.children}
      </span>
    </div>
  )
}

export class StarredIcon extends React.Component {

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

    if (props.state.starredAction) {
      props.state.starredAction(state.type, props.data.tmdb, !state.active)
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

export class Loader extends React.Component {

  initialState = {
    prevItem:  0,
    itemText: undefined
  }

  constructor(props) {
    super(props)

    this.state = this.initialState
  }

  getSpinner() {
    const {container, spinner, items} = this.props

    const searchSpinner = classNames('search-spinner load-spinner no-query', spinner)
    const spinnerContainer = classNames('spinner-container', container)

    return (
      <div>
        <div className={searchSpinner}>
          <div className={spinnerContainer}>
            <div className="spinner-line line01"></div>
            <div className="spinner-line line02"></div>
            <div className="spinner-line line03"></div>
            <div className="spinner-line line04"></div>
            <div className="spinner-line line05"></div>
            <div className="spinner-line line06"></div>
            <div className="spinner-line line07"></div>
            <div className="spinner-line line08"></div>
            <div className="spinner-line line09"></div>
            <div className="spinner-line line10"></div>
            <div className="spinner-line line11"></div>
            <div className="spinner-line line12"></div>
          </div>
        </div>
        {items &&
          <p style={{textAlign: 'center'}}>
            {this.state.itemText}
          </p>
        }
      </div>
    )
  }

  randomItem = () => {
    const {items} = this.props
    const {prevItem} = this.state

    const randomNumber = randNum(0, items.length)
    console.log(randomNumber, items.length)

    const itemValue = items[randomNumber]

    console.log(itemValue)

    this.setState({
      prevItem: randomNumber,
      itemText: itemValue
    })
  }

  componentDidMount() {
    if (this.props.items) {
      this.randomItem()
      this.interval = window.setInterval(this.randomItem, 1000)
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    const {top} = this.props

    return top ? (
      <div style={{marginTop: top}}>
        {this.getSpinner()}
      </div>
    ) : (
      this.getSpinner()
    )
  }
}
