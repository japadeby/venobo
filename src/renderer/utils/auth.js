/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'
import CryptoJS from 'crypto-js'
import { Redirect } from 'react-router'
import { APP } from '../../config'

import App from './app'
import View from '../components/view'
import Session from './session'
import HTTP from './http'

import Login from '../components/login'
import Home from '../components/home'

export default class Auth extends React.Component {

  /**
   * Encrypt a string, object or array
   */
  static encrypt(value) {
    if(typeof value === 'object')
      value = JSON.stringify(value)

    let enc = CryptoJS.AES.encrypt(value, APP.SECRET_KEY)

    return enc.toString()
  }

  /**
   * Decrypt a string, object or array
   */
  static decrypt(value) {
    let bytes = CryptoJS.AES.decrypt(value, APP.SECRET_KEY),
        bytesToStr = bytes.toString(CryptoJS.enc.Utf8)

    return (typeof bytesToStr === 'object') ? JSON.parse(bytesToStr) : bytesToStr
  }

  static login(username: String, token: String) {
    // Write user data to session
    Session.write({
      username: username,
      token: token
    })
    // Show home page
    App.render(<View><Home /></View>)
  }

  static logout() {
    // Remove session items
    Session.remove(['username', 'token'])
    // Show index page
    App.render(<Login />)
  }

  static isUserLogged(callback: Function) {
    if(Session.exists(['username', 'token'])) {
      HTTP.post(`${APP.URL}/verify`, {
        username: Session.read('username'),
        token: Session.read('token')
      }, callback)
    } else {
      callback(false)
    }
  }

}
