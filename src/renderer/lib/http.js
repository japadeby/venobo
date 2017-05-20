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

  static Cache: Object

  static setup() {
    this.Cache = new LocalStorage(config.PATH.CACHE, config.APP.SECRET_KEY)
  }

  static cacheExistsThenRead(url: String) {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => {
          Cache.write(url, res.data, resolve)
        })
        .catch(err => {
          Cache.existsThenRead(url)
            .then(resolve)
            .catch(() => reject(err))
        })
    })
  }

  static fetchTorrent(url: String) {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.isNotExpiredThenRead(url, config.CACHE_DURATION)
        .then(resolve)
        .catch(() => {
          this.cacheExistsThenRead(url)
            .then(resolve)
            .catch(reject)
        })
    })
  }

  static get(url: String) {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(url)
        .then(resolve)
        .catch(() => {
          this.cacheExistsThenRead(url)
            .then(resolve)
            .catch(reject)
        })
    })
  }

}
