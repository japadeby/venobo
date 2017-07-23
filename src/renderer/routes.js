import React from 'react'
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

export default ({ saved }) => {
  const getIndex = () => {
    if (saved.prefs.shouldSaveHistory) {
      return saved.history.location.pathname
    }

    return '/home'
  }

  const controllers = {
    '/home': HomeController
  }

  return (
    <MemoryRouter>
      <Switch>
        <View>
          <Route exact path="/" render={() => <Redirect to={getIndex()} />} />
          {Object.keys(controllers).map(path => {
            let Component = Multilingual.withTranslate(controllers[path])

            return (
              <PropsRoute exact key={path} path={path} component={Component} />
            )
          })}
        </View>
      </Switch>
    </MemoryRouter>
  )
}
