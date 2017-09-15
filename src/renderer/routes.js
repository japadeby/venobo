import React, { Component } from 'react'
import { Route as ReactRoute, Redirect, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import dispatch from './lib/dispatcher'

import { searchActions }  from './components/Search/redux'
import { tooltipActions } from './components/Tooltip/redux'

import { View, Multilingual } from './components'

@withRouter
@connect(null, {
  ...searchActions,
  ...tooltipActions
})
export default class Routes extends Component {

  getIndex = () => {
    //const { saved } = this.props.appState

    //if (saved.prefs.shouldSaveHistory) {
    //    return saved.history.location.pathname
    //}
    return '/home'
  }

  Route = ({ controller, path }) => (
    <ReactRoute path={path} render={routeProps => {
      this.props.dismissTooltip()
      this.props.searchDismiss()

      const component = require(`./pages/${controller}`)

      return React.createElement(component, routeProps)
    }} />
  )

  render() {
    const { Route } = this

    return (
      <View>
        <Switch>
          <ReactRoute exact path="/" render={() => <Redirect to={this.getIndex()} />} />
          <Route path="/home" controller="Home" />
          <Route path="/media/:type/:tmdb" controller="Media" />
          <Route path="/starred" controller="Starred" />
          <Route path="/discover/:type/:genre/:sortBy" controller="Discover" />
        </Switch>
      </View>
    )
  }

}
