import React, { Component } from 'react'
import { MemoryRouter, Redirect, Switch, Route } from 'react-router-dom'

import dispatch from './lib/dispatcher'
import { View, Multilingual } from './components'
import { HomeController } from './containers'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)

  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, ...rest }) => (
  <Route {...rest} render={routeProps => {
    dispatch(['exitSearchMount', 'hideTooltip'])
    dispatch('setHistory', routeProps.history)

    return renderMergedProps(component, routeProps, rest)
  }} />
)

@connect(state => ({
  saved: state.app.saved
}))
export default class Routes extends Component {

  controllers = {
    '/home': HomeController
  }

  getIndex() {
    const saved = this.props.saved

    if (saved.prefs.shouldSaveHistory) {
      return saved.history.location.pathname
    }

    return '/home'
  }

  render() {
    return (
      <MemoryRouter>
        <Switch>
          <View>
            <PropsRoute exact path="/" render={() => <Redirect to={this.getIndex()} />} />
            {Object.keys(this.controllers).map(path => {
              let Component = Multilingual.withTranslate(this.controllers[path])

              return (
                <PropsRoute exact key={path} path={path} component={Component} />
              )
            })}
          </View>
        </Switch>
      </MemoryRouter>
    )
  }

}
