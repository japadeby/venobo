import React, { Component } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { connect } from 'react-redux'

import config from '../../config'
import { withTranslate } from './react-multilingual'
import dispatch from '../lib/dispatcher'

import { searchActions } from './Search/redux'

@connect(
  state => ({
    app: state.app,
    search: state.search
   }),
  { ...searchActions }
)
class Header extends Component {

  userHover = () => {
    $(this.refs.user).children('.details.authenticated').addClass('active-hover')
  }

  userLeave = () => {
    $(this.refs.user).children('.details.authenticated').removeClass('active-hover')
  }

  render() {
    const { search, translate, searchToggle, app } = this.props

    const pageHeaderClass = classNames(
      'block page-header',
      { 'active-search': search.active }
    )

    const searchClass = classNames(
      'search',
      { 'active': search.active }
    )

    return (
      <div className={pageHeaderClass}>
        <div className="scaffold">
          <div className="logo">
            <Link to="/home">
              <img src={config.APP.LARGE_LOGO} width="144" height="35" />
            </Link>
          </div>
          <nav className="sections">
            <Link to="/discover/shows/all/popularity.desc">
              <span>{translate('nav.series')}</span>
            </Link>
            <Link to="/discover/movies/all/popularity.desc">
              <span>{translate('nav.movies')}</span>
            </Link>
          </nav>
          <div className="user" ref="user">
            <div className="details authenticated" onMouseEnter={this.userHover} onMouseLeave={this.userLeave}>
              <div className="summary">
                <button className="user-name">
                  <div>{app.saved.username}</div>
                </button>
              </div>
              <div className="dropdown">
                <div className="box-shadow">
                  <ul>
                    <li>
                      <Link to="/watched" className="icon watched">
                        <span>{translate('watched')}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/starred" className="icon starred">
                        <span>{translate('starred')}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/preferences" className="icon settings">
                        <span>{translate('preferences')}</span>
                      </Link>
                    </li>
                  </ul>
                  {/*<ul>
                    <li><a href="/package" className="package">Bestil pakke</a></li>
                    <li><a href="http://kundeservice.viaplay.dk" className="customer-service">Kundeservice</a></li>
                  </ul>*/}
                  <ul className="footer">
                    <li><a className="logout" onClick={() => dispatch('appQuit')}>Quit</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={searchClass} onClick={() => searchToggle()}>
            <div className="search-icon"></div>
          </div>
          <div className="search-backdrop"></div>
        </div>
      </div>
    )
  }

}

export default withTranslate(Header)