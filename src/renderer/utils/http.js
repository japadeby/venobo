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

  static get(url: String) {
    const {Storage} = this

    return new Promise((resolve, reject) => {
      Storage.isNotExpiredThenRead(url, 3 * 60) // 3hrs max storage duration
        .then(resolve)
        .catch(() => {
          axios.get(url)
            .then(res =>
              Storage.write(url, res.data, resolve)
            })
            .catch(err => {
              Storage.existsThenRead(url)
                .then(resolve)
                .catch(() => reject(err))
            })
        })
    })
  }

  /*static post(url: String, params: Object, callback: Function) {
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
  }*/

}
