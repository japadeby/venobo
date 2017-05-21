/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import axios from 'axios'

import config from '../../config'

export default class HTTP {

  static Cache: Object

  static setCache(cache) {
    this.Cache = cache
  }

  static get(url: String) {
    return axios.get(url)
      .then(res => res.data)
  }

  static fetch(url: String): Promise {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(url)
        .then(resolve)
        .catch(() => {
          this.get(url)
            .then(data => {
              Cache.write(url, data, resolve)
            })
            .catch(reject)
        })
    })
  }

  static fetchCache(url: String): Promise {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.isNotExpiredThenRead(url, config.CACHE_DURATION)
        .then(resolve)
        .catch(() => {
          this.fetch(url)
            .then(resolve)
            .catch(reject)
        })
    })
  }

}
