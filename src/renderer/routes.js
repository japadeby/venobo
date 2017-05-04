/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'
import { Route, IndexRoute } from 'react-router-dom'

import Home from './components/home'
import Settings from './components/settings'
import View from './components/view'
import Starred from './components/starred'

export default class Routes extends React.Component {
  render () {
    return (
      <View>
        <Route exact path={'/'} component={Home} />
        <Route path={'/preferences'} component={Settings} />
        <Route path={'/starred'} component={Starred} />
      </View>
    )
    /* return (
      <View>
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
      </View>
    ) */
  }
}
