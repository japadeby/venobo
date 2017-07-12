import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'

import { StarredIcon } from '../Items'
import { withTranslate } from '../react-multilingual'

@connect(
  state => ({ ...state.tooltip }),
  { ...tooltipActions }
)
class Tooltip extends Component {

  render() {
    const { data, enabled, setTooltipEnabled, setTooltipDisabled, setDisabled } = this.props

    {/*tooltip left*/}
    return (
      <div id="tooltip">
        {enabled ? (
          <section className={classNames('tooltip', data.style.class)} onMouseEnter={setTooltipEnabled} onMouseLeave={setTooltipDisabled} style={data.style.position}>
            <header>
              <h1>
                <Link to={data.pageLink} className="page-link" onClick={setDisabled}>
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
                <StarredIcon type="button" key={data.tmdb} data={data} />
              </div>
              <p className="group synopsis">
          			<span>{data.summary}</span>
          			<Link to={data.pageLink} className="page-link" onClick={setDisabled}>
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
              <Link to={data.pageLink} className="page-link read-more movies" onClick={setDisabled}>
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
