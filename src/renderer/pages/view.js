import React from 'react'

import Footer from '../components/footer'
import Header from '../components/header'

export default class View extends React.Component {

  render() {
    const {props} = this

    return (
      <div>
        <Header />
        <div id="content" className="section">
          <div className="dockable" />
          {props.children}
        </div>
        <Footer />
      </div>
    )
  }

}