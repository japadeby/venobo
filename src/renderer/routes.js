import React from 'react'
import { MemoryRouter, Redirect, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import dispatch from './lib/dispatcher'

import { View, Multilingual } from './components'
import {
  HomeController,
  MediaController,
  StarredController,
  DiscoverController
} from './pages'

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

  return (
    <MemoryRouter>
      <Switch>
        <View>
          <Route exact path="/" render={() => <Redirect to={getIndex()} />} />
          <PropsRoute path="/home" component={HomeController} />
          <PropsRoute path="/media/:type/:tmdb" component={MediaController} />
          <PropsRoute path="/starred" component={StarredController} />
          <PropsRoute path="/discover/:type/:genre/:sortBy" component={DiscoverController} />
          {/*Object.keys(controllers).map(path => {
            let Component = Multilingual.withTranslate(controllers[path])

            return (
              <PropsRoute exact key={path} path={path} component={() => require(Component} />
            )
          })*/}
        </View>
      </Switch>
    </MemoryRouter>
  )
}
