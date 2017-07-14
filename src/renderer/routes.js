import React, { Component } from 'react'
import { MemoryRouter, Redirect, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import dispatch from './lib/dispatcher'
import { View, Multilingual } from './components'
import { HomeController } from './containers'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)

  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, ...rest }) => (
  <Route {...rest} render={routeProps => {
    dispatch('exitSearchMount')
    dispatch('hideTooltip')
    dispatch('setHistory', routeProps.history)

    return renderMergedProps(component, routeProps, rest)
  }} />
)

export default class Routes extends Component {

  controllers = {
    '/home': HomeController
  }

  getIndex() {
    const {saved} = this.props.state

    if (saved.prefs.shouldSaveHistory) {
      return saved.history.location.pathname
    }

    return '/home'
  }

  render() {
    const {state} = this.props

    return (
      <MemoryRouter>
        <Switch>
          <View>
            <Route exact path="/" render={() => <Redirect to={this.getIndex()} />} />
            {Object.keys(this.controllers).map(path => {
              let Component = Multilingual.withTranslate(this.controllers[path])

              return (
                <PropsRoute exact key={path} path={path} component={Component} appState={state} />
              )
            })}
          </View>
        </Switch>
      </MemoryRouter>
    )
  }

}
