import React from 'react'
import {MemoryRouter as Router, Route, Redirect} from 'react-router-dom'

import View from './components/view'
import {IntlProvider, withTranslate} from './components/react-multilingual'

import HomeController from './controllers/home'
import PreferencesController from './controllers/preferences'
import MediaController from './controllers/media'
import StarredController from './controllers/starred'

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
      //dispatch('setLocation', routeProps.location)
      dispatch('setHistory', routeProps.history)

      return renderMergedProps(component, routeProps, rest)
    }} />
  )
}

export default class App extends React.Component {

  controllers = {
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
        <Router onUpdate={() => window.scrollTo(0, 0)}>
          <View state={props.state}>
            <Route exact path="/" render={() => <Redirect to={this.getLastRoute()} />} />
            {Object.keys(controllers).map(path => {
              let Component = withTranslate(controllers[path])

              return (<div key={path}>
                <PropsRoute path={path} component={Component} state={props.state} />
              </div>)
            })}
          </View>
        </Router>
      </IntlProvider>
    )
  }

  getLastRoute() {
    try {
      const {pathname} = this.props.state.saved.history.location

      return pathname
    } catch(e) {
      console.log(e)
      // No match? Don't worry, just return the default home controller
      return '/home'
    }
  }

}
