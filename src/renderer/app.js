import React from 'react'
import {
  MemoryRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import View from './components/view'
import {
  IntlProvider,
  withTranslate
} from './components/react-multilingual'

import HomeController from './pages/controllers/home'
import PreferencesController from './pages/controllers/preferences'
import MediaController from './pages/controllers/media'
import StarredController from './pages/controllers/starred'
import DiscoverController from './pages/controllers/discover'
import PlayerController from './pages/controllers/player'
//import ShowsController from './pages/controlers/shows'

import {dispatch} from './lib/dispatcher'

/**
 * @author @tchaffee <https://github.com/ReactTraining/react-router/issues/4105>
 */
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return (
    React.createElement(component, finalProps)
  )
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      dispatch('exitSearchMount')
      dispatch('hideTooltip')
      dispatch('setLocation', routeProps.location.pathname)
      dispatch('setHistory', routeProps.history)

      return renderMergedProps(component, routeProps, rest)
    }} />
  )
}

export default class App extends React.Component {

  controllers = {
    '/discover/:type/:genre/:sortBy': DiscoverController,
    //'/discover/:type': DiscoverController,
    //'/shows/:genre/:sort': ShowsController,
    '/home': HomeController,
    '/media/:type/:tmdb': MediaController,
    //error: ['/error', ErrorController],
    '/preferences': PreferencesController,
    '/starred': StarredController
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {props, controllers} = this
    const {translation, locale, history} = props

    return (
      <IntlProvider translations={translation} locale={locale}>
        <Router>
          <Switch>
            <PropsRoute path="/player/:type/:tmdb/:quality" component={withTranslate(PlayerController)} state={props.state} />
            <View state={props.state}>
              <Route exact path="/" render={() => <Redirect to={this.getIndex()} />} />
              {Object.keys(controllers).map(path => {
                let Component = withTranslate(controllers[path])

                return (
                  <PropsRoute exact
                    key={path}
                    path={path}
                    component={Component}
                    state={props.state}
                  />
                )
              })}
            </View>
          </Switch>
        </Router>
      </IntlProvider>
    )
  }

  getIndex() {
    const {saved} = this.props.state
    const {pathname} = saved.history.location

    if (saved.prefs.shouldSaveHistory) {
      return pathname
    }

    return '/home'
  }

}
