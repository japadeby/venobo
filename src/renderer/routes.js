import React, { Component } from 'react'
import { IndexRoute, Route, Redirect } from 'react-router'

import { View, Multilingual } from './components'
import { HomeController } from './containers'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, ...rest }) => (
  <Route {...rest} render={routeProps => {
    return renderMergedProps(component, routeProps, rest)
  }} />
)

@connect(state => ({
  saved: state.saved
}))
export default class Routes extends Component {

  controllers = {
    '/home': HomeController
  }

  getIndex() {
    const { saved } = this.props

    if (saved.prefs.shouldSaveHistory) {
      return saved.history.location.pathname
    }

    return '/home'
  }

  render() {
    return (
      <View>
        <Route exact path="/" render={() => <Redirect to={this.getIndex()} />} />
        {Object.keys(this.controllers).map(path => {
          let Component = Multilingual.withTranslate(this.controllers[path])

          return (
            <Route exact key={path} path={path} component={Component} />
          )
        })}
      </View>
    )
  }

}
