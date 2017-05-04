/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'
import Auth from './auth'

export default class Session extends React.Component {

  static write(data: Object) {
    for(let key in data) {
      data[key] = Auth.encrypt(data[key])
      localStorage.setItem(key, data[key])
    }
    return data
  }

  static read(key: String) {
    return Auth.decrypt(localStorage.getItem(key))
  }

  static exists(arr: Array) {
    for(let key in arr) {
      let exists = (localStorage.getItem(arr[key]) !== null)

      if(!exists) return false
    }

    return true
  }

  static remove(arr: Array) {
    for(let key in arr) {
      localStorage.removeItem(arr[key])
    }
  }

}
