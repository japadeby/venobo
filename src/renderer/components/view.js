import React from 'react'

import Header from './header'
import Tooltip from './tooltip'

export default class View extends React.Component {

  render() {
    const {props} = this

    return (
      <div>
        <Header state={props.state} />
        {props.children}
        <Tooltip state={props.state} />
      </div>
    )
  }

}
