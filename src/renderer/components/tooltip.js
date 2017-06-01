import React from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames'

import {StarredIcon} from './items'
import {withTranslate} from './react-multilingual'

class Tooltip extends React.Component {

  constructor(props) {
    super(props)

    props.state.tooltip.toggle = this.toggle.bind(this)

    this.state = {
      data: {},
      enabled: false
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

    tooltip.timeout = setTimeout(this.setDisabled, tooltip.delay)
  }

  setDisabled = () => {
    const {tooltip} = this.props.state

    if (!tooltip.poster) {
      tooltip.enabled = false

      this.setState({ enabled: false })
    }
  }

  render() {
    const {state} = this.props
    const {tooltip} = state
    const {data, enabled} = this.state

    {/*tooltip left*/}
    return (
      <div id="tooltip">
        {enabled ? (
          <section className={classNames('tooltip', data.style.class)} onMouseEnter={this.setTooltipEnabled} onMouseLeave={this.setTooltipDisabled} style={data.style.position}>
            <header>
              <h1>
                <Link to={data.pageLink} className="page-link" onClick={this.setDisabled}>
                  <span>{data.title}</span>
                </Link>
              </h1>
              <p className="time"></p>
              <p className="genres">
                {data.genres.join(' / ')}
              </p>
              <p className="year divider">{String(data.year)}</p>
              <p className="duration divider">{data.runtime}</p>
              <span className="flags">
                {data.torrents != null ? Object.keys(data.torrents).map(quality => {
                  return (<span className="flag" key={quality}>{quality}</span>)
                }) : ''}
              </span>
            </header>
            <div className="body">
              <div className="interaction-block">
                <div className="tmdb-container">
                  <a href="#" className="tmdb-link">
                    {data.voted}
                  </a>
                </div>
                <StarredIcon type="button" key={data.tmdb} data={data} state={state} />
              </div>
              <p className="group synopsis">
          			<span>{data.summary}</span>
          			<Link to={data.pageLink} className="page-link" onClick={this.setDisabled}>
                  <span>Læs mere</span>
                </Link>
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
              <div className="arrow" style={{top: `${data.style.arrow}px`}}></div>
            </div>
            <footer className="two-button">
              <Link to={data.pageLink} className="page-link read-more movies" onClick={this.setDisabled}>
                <span>Mere info</span>
              </Link>
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
