import React from 'react'
import classNames from 'classnames'

import dispatch from '../lib/dispatcher'
import Footer from './Footer'

export const SectionMenu = ({ children }) => (
  <secton className="block section-menu active">
    {children}
  </secton>
)

export const SectionWrapper = ({ children }) => (
  <div className="section-wrapper">
    {children}
  </div>
)

export const Content = ({ className, children }) => (
  <div id="content" className={className}>
    {children}
    <Footer />
  </div>
)

export const ContentCategory = (props) => (
  <Content classNames={classNames('category', className)}>
    {children}
  </Content>
)

export const ContentStarred = ({ className, children }) => (
  <Content classNames={classNames('starred', className)}>
    {children}
  </Content>
)

export const ContentSection = ({ children }) => (
  <Content className="section">
    {children}
  </Content>
)

export const ContentProduct = ({ children }) => (
  <Content className="product">
    {children}
  </Content>
)

export const MovieProduct = ({ children }) => (
  <section className="block product movie">
    {children}
  </section>
)

export const PlayerWrapper = ({ onClick }) => (
  <div className="block-product">
    <Scaffold>
      <div className="player-wrapper">
        <div className="react-play-button large" onClick={onClick}>
          <figure className="icon-content"></figure>
        </div>
      </div>
    </Scaffold>
  </div>
)

export const Hero = ({ children, className }) => (
  <section className={classNames('hero', className)}>
    {children}
  </section>
)

export const HeroWrapper = ({ children }) => (
  <div className="hero-wrapper">
    {children}
  </div>
)

export const Scaffold = ({ children, className }) => (
  <div className={classNames('scaffold', className)}>
    {children}
  </div>
)

export const CollectionHeader = ({ children }) => (
  <header className='collection-header'>
    {children}
  </header>
)

export const BlockCollection = ({ className, children }) => (
  <section className={classNames('block collection', className)}>
    {children}
  </section>
)

export const HeaderButton = ({ onClick, children }) => (
  <span onClick={onClick} className='see-all button'>{children}</span>
)

export const ReactGrid = ({ className, children }) => (
  <div className={classNames('react-grid', className)}>
    <span>
      {children}
    </span>
  </div>
)

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

export const Loader = ({ top, container, spinner }) => {
  const searchSpinner = classNames('search-spinner load-spinner no-query', spinner)
  const spinnerContainer = classNames('spinner-container', container)

  return (
    <div className={searchSpinner} style={{marginTop: top}}>
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
  )
}

/*export class Loader extends React.Component {

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
}*/
