import React from 'react'
import {NavLink} from 'react-router-dom'

import config from '../../config'
import {withTranslate} from './react-multilingual'
import {dispatch} from '../lib/dispatcher'

class Header extends React.Component {

  constructor(props) {
    super(props)

    props.state.search.toggle = this.toggleSearchMount
  }

  userHover = () => {
    $(this.refs.user).children('.details.authenticated').addClass('active-hover')
  }

  userLeave = () => {
    $(this.refs.user).children('.details.authenticated').removeClass('active-hover')
  }

  toggleSearchMount = () => {
    const $search = $(this.refs.search)
    if (!$search.hasClass('active')) {
      $search.addClass('active')
    } else {
      $search.removeClass('active')
    }
    this.props.state.search.mount()
  }

  render() {
    const {translate, state} = this.props

    return (
      <div className="block page-header">
        <div className="scaffold">
          <div className="logo">
            <NavLink to="/home">
              <img src={config.APP.LARGE_LOGO} width="144" height="35" />
            </NavLink>
          </div>
          <nav className="sections">
            <NavLink to="/discover/shows/all/popularity.desc">
              <span>{translate('nav.series')}</span>
            </NavLink>
            <NavLink to="/discover/movies/all/popularity.desc">
              <span>{translate('nav.movies')}</span>
            </NavLink>
          </nav>
          <div className="user" ref="user">
            <div className="details authenticated" onMouseEnter={this.userHover} onMouseLeave={this.userLeave}>
              <div className="summary">
                <button className="user-name">
                  <div>{state.saved.username}</div>
                </button>
              </div>
              <div className="dropdown">
                <div className="box-shadow">
                  <ul>
                    <li>
                      <NavLink to="/watched" className="icon watched">
                        <span>{translate('watched')}</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/starred" className="icon starred">
                        <span>{translate('starred')}</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/preferences" className="icon settings">
                        <span>{translate('preferences')}</span>
                      </NavLink>
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
          <div className="search" ref="search" onClick={this.toggleSearchMount}>
            <div className="search-icon"></div>
          </div>
          <div className="search-backdrop"></div>
        </div>
      </div>
    )
  }

}

export default withTranslate(Header)
