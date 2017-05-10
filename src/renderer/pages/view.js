import React from 'react'

import Footer from '../components/footer'
import Header from '../components/header'

import Tooltip from '../components/tooltip'

export default class View extends React.Component {

  render() {
    const {props} = this

    return (
      <div style={{height: '100%'}}>
        <Header state={props.state} />
        <div id="content" className="section">
          <div className="dockable" />
          {props.children}
        </div>
        <Tooltip state={props.state} />
        <Footer state={props.state} />
      </div>
    )
  }

}
