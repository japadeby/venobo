import React from 'react'

import Footer from '../components/footer'
import Header from '../components/header'
import Tooltip from '../components/tooltip'

export default class View extends React.Component {

  render() {
    const {props} = this

    return (
      <div>
        <Header state={props.state} />
        {props.children}
        <Tooltip state={props.state} />
        <Footer state={props.state} />
      </div>
    )
  }

}
