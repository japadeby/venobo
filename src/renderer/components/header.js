import React from 'react'
import { NavLink } from 'react-router-dom'

import config from '../../config'
import { withTranslate } from '../utils/react-multilingual'

class Header extends React.Component {

  userHover = () => {
    $(this.refs.user).children('.details.authenticated').addClass('active-hover')
  }

  userLeave = () => {
    $(this.refs.user).children('.details.authenticated').removeClass('active-hover')
  }

  searchHover = () => {
    var $s = $(this.refs.search)
    if(!($s.hasClass('focus'))) {
      $(this.refs.user).addClass('collapse')
      $s.addClass('expand')
    }
  }

  searchLeave = () => {
    var $s = $(this.refs.search)
    if(!($s.hasClass('focus'))) {
      $(this.refs.user).removeClass('collapse')
      $s.removeClass('expand')
    }
  }

  searchFocus = () => {
    var $s = $(this.refs.search)
    if(!($s.hasClass('focus'))) {
      document.addEventListener('click', this.searchHandleFocus, false)
      $s.addClass('focus')
    }
  }

  searchHandleFocus = (e) => {
    if(!document.querySelector('.search').contains(e.target)) {
      $(this.refs.user).removeClass('collapse')
      $(this.refs.search).removeClass('focus active expand')
      e.stopPropagation()
    }
  }

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.searchHandleFocus, false)
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
            <NavLink to="/series">{translate('nav.series')}</NavLink>
            <NavLink to="/movies">{translate('nav.movies')}</NavLink>
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
                        {translate('watched')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/starred" className="icon starred">
                        {translate('starred')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/preferences" className="icon settings">
                        {translate('preferences')}
                      </NavLink>
                    </li>
                  </ul>
                  {/*<ul>
                    <li><a href="/package" className="package">Bestil pakke</a></li>
                    <li><a href="http://kundeservice.viaplay.dk" className="customer-service">Kundeservice</a></li>
                  </ul>*/}
                  <ul className="footer">
                    <li><a className="logout">{translate('logout')}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="search" ref="search" onMouseEnter={this.searchHover} onMouseLeave={this.searchLeave} onClick={this.searchFocus}>
            <input className="searchfield" autoComplete="off" ref="searchPhrase" placeholder={translate('nav.search')} type="search" />
				    <div className="result dropdown">
              <div className="list"></div>
              <p className="empty-result">Intet resultat</p>
              <a href="" className="show-all">
                <div className="loading load-spinner dark small">
                  <div className="spinner-container dark">
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
						    <p>Vis alle resultater</p>
              </a>
            </div>
            <button className="search-abort"></button>
				    <div className="search-backdrop"></div>
			    </div>
        </div>
      </div>
    )
  }

}

export default withTranslate(Header)
