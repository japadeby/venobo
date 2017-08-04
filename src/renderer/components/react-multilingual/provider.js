import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { supplant, translateKey, createHTMLMarkup } from './utils'

export default class IntlProvider extends Component {

  constructor (props) {
    super(props)
    if (!props.translations) {
      let namePart = this.constructor.displayName ? ' of ' + this.constructor.displayName : ''
      throw new Error('Could not find translations or locale on this.props ' + namePart)
    }
  }

  static childContextTypes = {
    translate: PropTypes.func
  }

  getChildContext () {
    return {
      translate: this.translate
    }
  }

  translate = (key, placeholders, isHTML) => {
    let result = translateKey(key, this.props.translations)
    if (typeof placeholders === 'undefined') {
      return result
    }

    return isHTML
      ? <div dangerouslySetInnerHTML={createHTMLMarkup(supplant(result, placeholders))} />
      : supplant(result, placeholders)
  }

  render () {
    return Children.only(this.props.children)
  }

}
