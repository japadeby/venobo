import React, { Component } from 'react'
import { MemoryRouter, Redirect, Switch, Route as ReactRoute } from 'react-router-dom'
import { connect } from 'react-redux'

import dispatch from './lib/dispatcher'

import { searchActions }  from './components/Search/redux'
import { tooltipActions } from './components/Tooltip/redux'

import { View, Multilingual } from './components'

/*const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)

  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, store, ...rest }) => (
  <Route {...rest} render={routeProps => {
    console.log(routeProrps)
    //dispatch('exitSearchMount')
    //dispatch('hideTooltip')
    //dispatch('setHistory', routeProps.history)

    return renderMergedProps(component, routeProps, rest)
  }} />
)*/

@connect(null, {
  ...searchActions,
  ...tooltipActions
})
export default class Routes extends Component {

  getIndex = () => {
    /*if (saved.prefs.shouldSaveHistory) {
        return saved.history.location.pathname
    }*/
    return '/home'
  }

  /*renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest)

    return React.createElement(component, finalProps)
  }*/

  Route = ({ controller, path }) => (
    <ReactRoute path={path} render={routeProps => {
      this.props.dismissTooltip()
      this.props.searchDismiss()

      const component = require(`./pages/${controller}/controller`)

      return React.createElement(component, routeProps)
      //this.renderMergedProps(component, routeProps, rest)
    }} />
  )

  render() {
    const { Route } = this

    return (
      <MemoryRouter>
        <Switch>
          <View>
            <ReactRoute exact path="/" render={() => <Redirect to={this.getIndex()} />} />
            <Route path="/home" controller="Home" />
            <Route path="/media/:type/:tmdb" controller="Media" />
            <Route path="/starred" controller="Starred" />
            <Route path="/discover/:type/:genre/:sortBy" controller="Discover" />
          </View>
        </Switch>
      </MemoryRouter>
    )
  }

}
