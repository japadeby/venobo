import React from 'react'
import { NavLink } from 'react-router-dom'

import {StarredButton} from './items'
import {withTranslate} from '../utils/react-multilingual'

class Tooltip extends React.Component {

  constructor(props) {
    super(props)

    const {tooltip} = props.state

    tooltip.toggle = this.toggle.bind(this)

    this.state = {
      data: {},
      enabled: false,
      summaryMaxLength: 300
    }
  }

  toggle(state, data: Object = {}) {
    const {tooltip} = this.props.state
    const {enabled} = this.state

    tooltip.enabled = state

    this.setState({
      enabled: state,
      data: data
    })

    clearTimeout(tooltip.timeout)
  }

  setTooltipEnabled = () => {
    const {tooltip} = this.props.state

    tooltip.poster = false

    clearTimeout(tooltip.timeout)
  }

  setTooltipDisabled = () => {
    const {tooltip} = this.props.state

    tooltip.timeout = setTimeout(() => {
      if (!tooltip.poster) {
        tooltip.enabled = false

        this.setState({
          enabled: false
        })
      }
    }, tooltip.delay)
  }

  componentWillUnmount() {
    clearTimeout(this.props.state.tooltip.timeout)
  }

  render() {
    const {state} = this.props
    const {tooltip} = state
    const {data, enabled, summaryMaxLength} = this.state

    {/*tooltip left*/}
    return (
      <div id="tooltip">
        {enabled ? (
          <section className="tooltip" onMouseEnter={this.setTooltipEnabled} onMouseLeave={this.setTooltipDisabled} style={{top: `${data.style.top}px`, left: `${data.style.left}px`}}>
            <header>
              <h1>
                <NavLink to={data.pageLink} className="page-link">
                  {data.title}
                </NavLink>
              </h1>
              <p className="time">{data.runtime}</p>
              <p className="genres">
                {data.genres.join(' / ')}
              </p>
              <p className="year divider">{String(data.year)}</p>
              <p className="duration divider">{data.runtime}</p>
              <span className="flags">
                {Object.keys(data.torrents).map(quality => {
                  return (<span className="flag">{quality}</span>)
                })}
              </span>
            </header>
            <div className="body">
              <div className="interaction-block">
                <div className="imdb-container">
                  <a href="#" className="imdb-link">
                    {data.rating}
                  </a>
                </div>
                <StarredButton key={data.tmdb} tmdb={data.tmdb} state={state}  />
              </div>
              <p className="group synopsis">
          			<span>{data.summary}</span>
          			<NavLink to="/" className="page-link">Læs mere</NavLink>
          		</p>
              <span className="group people">
                <div className="people-list actors">
                  <h2>Actors:</h2>
                  <p>

                  </p>
                </div>
                <div className="people-list directors">
                  <h2>Director: </h2>
                  <p>
                    qwe
                  </p>
                </div>
              </span>
            </div>
            <div className="gutter">
              <div className="arrow" style={{top: '138px'}}></div>
            </div>
            <footer className="two-button">
              <NavLink to={data.pageLink} className="page-link read-more movies"> {/*series?*/}
                Mere info
              </NavLink>
            </footer>
          </section>
        ) : (
          <div></div>
        )}
      </div>
    )
  }

}

export default withTranslate(Tooltip)
