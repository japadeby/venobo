import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { observer, inject } from 'mobx-react';
import * as classNames from 'classnames';

import { SearchStore } from '../stores/search.store';
import { ConfigState } from '../stores/config.store';

export interface HeaderState {
  hoverActive: boolean;
}

export interface HeaderProps extends InjectedTranslateProps {
  search: SearchStore;
  config: ConfigState;
}

@translate()
@inject(['search', 'config'])
@observer
export class Header extends React.Component<HeaderProps, HeaderState> {

  state = {
    hoverActive: false,
  };

  private hoverDetails = () => {
    this.setState({
      hoverActive: !this.state.hoverActive
    });
  };

  private quitApp = () => ipcRenderer.emit('appQuit');

  render() {
    const { config: { user }, search, t } = this.props;

    const pageHeaderClass = classNames(
      'block page-header',
      { 'active-search': search.active }
    );

    const searchClass = classNames(
      'search',
      { 'active': search.active }
    );

    return (
      <div className={pageHeaderClass}>
        <div className="scaffold">
          <div className="logo">
            <NavLink to="/home">
              <img src={'/some/url'} width="144" height="35" />
            </NavLink>
          </div>
          <nav className="sections">
            <NavLink to="/discover/shows/all/popularity.desc">
              <span>{t('nav.series')}</span>
            </NavLink>
            <NavLink to="/discover/movies/all/popularity.desc">
              <span>{t('nav.movies')}</span>
            </NavLink>
          </nav>
          <div className="user" ref="user">
            <div className="details authenticated" onMouseEnter={this.hoverDetails} onMouseLeave={this.hoverDetails}>
              <div className="summary">
                <button className="user-name">
                  <div>{user.id}</div>
                </button>
              </div>
              <div className="dropdown">
                <div className="box-shadow">
                  <ul>
                    <li>
                      <NavLink to="/watched" className="icon watched">
                        <span>{t('watched')}</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/starred" className="icon starred">
                        <span>{t('starred')}</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/preferences" className="icon settings">
                        <span>{t('preferences')}</span>
                      </NavLink>
                    </li>
                  </ul>
                  {/*<ul>
                    <li><a href="/package" className="package">Bestil pakke</a></li>
                    <li><a href="http://kundeservice.viaplay.dk" className="customer-service">Kundeservice</a></li>
                  </ul>*/}
                  <ul className="footer">
                    <li><a className="logout" onClick={this.quitApp}>Quit</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={searchClass} onClick={search.toggle}>
            <div className="search-icon" />
          </div>
          <div className="search-backdrop" />
        </div>
      </div>
    );
  }

}
