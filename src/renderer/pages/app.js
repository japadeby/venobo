/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'
import { IntlProvider, withTranslate } from '../utils/react-multilingual'

import Home from './home'
import Preferences from './preferences'
import Starred from './starred'
import Watched from './watched'
import Movies from './movies'
import Series from './series'

import Footer from '../components/footer'
import Header from '../components/header'

export default class App extends React.Component {

  static views: Object = {
    home: Home,
    preferences: Preferences,
    starred: Starred,
    watched: Watched,
    series: Series,
    movies: Movies
  }

  render() {
    const {state, locale, translation} = this.props
    // Hide player controls while playing video, if the mouse stays still for a while
    // Never hide the controls when:
    // * The mouse is over the controls or we're scrubbing (see CSS)
    // * The video is paused
    // * The video is playing remotely on Chromecast or Airplay
    const hideControls = state.shouldHidePlayerControls()

    const cls = [
      'view-' + state.location.url(), /* e.g. view-home, view-player */
      'is-' + process.platform /* e.g. is-darwin, is-win32, is-linux */
    ]
    if (state.window.isFullScreen) cls.push('is-fullscreen')
    if (state.window.isFocused) cls.push('is-focused')
    if (hideControls) cls.push('hide-video-controls')

    return (
      <IntlProvider translations={translation} locale={locale}>
        <div>
          <Header />
          <div id="content" className="section">
            <div className="dockable" />
            {this.getView()}
          </div>
          <Footer />
        </div>
      </IntlProvider>
    )
  }

  getView() {
    const {state} = this.props
    const View = withTranslate(this.views[state.location.url()]())
    return (<View state={state} />)
  }

}
