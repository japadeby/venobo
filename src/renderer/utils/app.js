/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

// Modules
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

export default class App {

  static init (provider, element) {
    ReactDOM.render(provider, document.querySelector(element))
  }

  static findNode (container) {
    return ReactDOM.findDOMNode(container)
  }

  static unmountComponent (node) {
    ReactDOM.unmountComponentAtNode(node)
  }

  static render (component) {
    return ReactDOMServer.renderToString(component)
  }
}
