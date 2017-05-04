/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'

import Header from './header'
import Footer from './footer'

export default class View extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Header />
        <div id="content" className="section">
          <div className="dockable" />

          {this.props.children}

          <Footer />
        </div>
      </div>
    )
  }
}
