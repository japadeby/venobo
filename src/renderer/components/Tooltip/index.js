import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'

import StarredIcon from '../StarredIcon'
import { withTranslate } from '../react-multilingual'

import { tooltipActions } from './redux'

@connect(
  state => ({ ...state.tooltip }),
  tooltipActions
)
export default class Tooltip extends Component {

  render() {
    const { data, active } = this.props

    return (
      <div id="tooltip">
        {active &&
          <section
            onMouseEnter={(e) => this.props.enable('tooltip')}
            onMouseLeave={this.props.disable}
            className={classNames('tooltip', data.style.class)}
            style={data.style.position}
          >
            <header>
              <h1>
                <Link to={data.pageLink} className="page-link">
                  <span>{data.title}</span>
                </Link>
              </h1>
              <p className="time"></p>
              <p className="genres">
                {data.genres.join(' / ')}
              </p>
              <p className="year divider">{data.year}</p>
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
          			<Link to={data.pageLink} className="page-link">
                  <span>Læs mere</span>
                </Link>
          		</p>
              <span className="group people">
                <div className="people-list actors">
                  <h2>Actors:</h2>
                </div>
                <div className="people-list directors">
                  <h2>Director:</h2>
                </div>
              </span>
            </div>
            <div className="gutter">
              <div className="arrow" style={{top: `${data.style.arrow}px`}}></div>
            </div>
            <footer className="two-button">
              <Link to={data.pageLink} className="page-link read-more movies">
                <span>Mere info</span>
              </Link>
            </footer>
          </section>
        }
      </div>
    )
  }

}
