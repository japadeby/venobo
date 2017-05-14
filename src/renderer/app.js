import React from 'react'
import {MemoryRouter, Route} from 'react-router-dom'

import View from './pages/view'

import HomeController from './controllers/home'
import PreferencesController from './controllers/preferences'
import MovieController from './controllers/movie'

import {dispatch} from './lib/dispatcher'
import {IntlProvider, withTranslate} from './utils/react-multilingual'

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
      dispatch('setLocation', routeProps.location)
      dispatch('setHistory', routeProps.history)

      return renderMergedProps(component, routeProps, rest)
    }} />
  )
}

export default class App extends React.Component {

  controllers = {
    '/home': HomeController,
    '/movie/:tmdb': MovieController,
    //error: ['/error', ErrorController],
    '/preferences': PreferencesController
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {props, controllers} = this
    const {translation, locale, history} = props

    return (
      <IntlProvider translations={translation} locale={locale}>
        <MemoryRouter>
          <View state={props.state}>
            <PropsRoute exact path="/" component={this.getLastRoute()} state={props.state} />
            {Object.keys(controllers).map(path => {
              let Component = withTranslate(controllers[path])

              return (<div key={path}>
                <PropsRoute path={path} component={Component} state={props.state} />
              </div>)
            })}
          </View>
        </MemoryRouter>
      </IntlProvider>
    )
  }

  getLastRoute() {
    const {controllers} = this

    try {
      const {pathname} = this.props.state.saved.location

      for (let path in controllers) {
        if (path === pathname) {
          return controllers[path]
        }
      }
    } catch(e) {
      // No match? Don't worry, just return the default home controller
      return controllers['/home']
    }
  }

}
