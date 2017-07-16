import React, { Component } from 'react'

import Header from './Header'
import Search from './Search'
import Tooltip from './Tooltip'

export default class View extends React.Component {

  render() {
    const {props} = this

    return (
      <div>
        <Header />
        {props.children}
        <Search />
        <Tooltip />
      </div>
    )
  }

}
