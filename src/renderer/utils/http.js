/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import Axios from 'axios'
import md5 from 'crypto-js/md5'
import React from 'react'
import LocalStorage from 'local-storage-es6'

const HttpCache = new LocalStorage(config.PATH.CACHE, config.APP.SECRET_KEY)

export default class HTTP {

  static get(url: String, callback: Function) {
    HttpCache.isNotExpiredThenRead(url, 3 * 60)
      .then(callback)
      .catch(() => {
        Axios.get(url)
          .then(res => {
            HttpCache.write(url, res.data, callback)
          })
          .catch(err => {
            this.parse(url, err, callback)
          })
      })
  }

  static post(url: String, params: Object, callback: Function) {
    // To make sure the caching works with post requests, the params needs to be added as the cache id
    var urlParam = url + md5(JSON.stringify(params))
    HttpCache.isNotExpiredThenRead(urlParam, 3 * 60)
      .then(callback)
      .catch(() => {
        Axios.post(url, params)
          .then(res => {
            HttpCache.write(urlParam, res.data, callback)
          })
          .catch(err => {
            this.parse(urlParam, err, callback)
          })
      })
  }

  static parse(url: String, err: String, callback: Function) {
    HttpCache.existsThenRead(url)
      .then(callback)
      .catch(() => console.warn(err))
  }

}
