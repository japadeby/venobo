import React from 'react'

import Header from './header'
import SearchMount from './search'
import Tooltip from './tooltip'

export default class View extends React.Component {

  render() {
    const {props} = this

    return (
      <div>
        <Header state={props.state} />
        {props.children}
        <SearchMount state={props.state} />
        <Tooltip state={props.state} />
      </div>
    )
  }

}
