/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import axios from 'axios'
import md5 from 'crypto-js/md5'
import React from 'react'
import LocalStorage from 'local-storage-es6'
import config from '../../config'

export default class HTTP {

  static Storage: Object

  static setup() {
    this.Storage = new LocalStorage(config.PATH.CACHE, config.APP.SECRET_KEY)
  }

  static get(url: String, callback: Function) {
    const {Storage} = this

    Storage.isNotExpiredThenRead(url, 3 * 60)
      .then(callback)
      .catch(() => {
        axios.get(url)
          .then(res => {
            Storage.write(url, res.data, callback)
          })
          .catch(err => {
            this.parse(url, err, callback)
          })
      })
  }

  static post(url: String, params: Object, callback: Function) {
    const {Storage} = this

    // To make sure the caching works with post requests, the params needs to be added as the cache id
    var urlParam = url + md5(JSON.stringify(params))
    Storage.isNotExpiredThenRead(urlParam, 3 * 60)
      .then(callback)
      .catch(() => {
        axios.post(url, params)
          .then(res => {
            Storage.write(urlParam, res.data, callback)
          })
          .catch(err => {
            this.parse(urlParam, err, callback)
          })
      })
  }

  static parse(url: String, err: String, callback: Function) {
    this.Storage.existsThenRead(url)
      .then(callback)
      .catch(console.warn)
  }

}
