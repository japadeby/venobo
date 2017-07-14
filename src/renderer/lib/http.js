/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import axios from 'axios'
import {RateLimiter} from 'limiter'

import config from '../../config'

export default class HTTP {

  static Cache: Object
  static Limiter: Object
  static axios: Object

  static setup(state) {
    this.axios = axios
    this.Limiter = new RateLimiter(3, 1000) // limit 3 requests every 1 second
    this.Cache = state.cache
  }

  static create(options: Object = {}): Object {
    // See comment on <https://stackoverflow.com/a/41474987>
    const clone = Object.assign(Object.create(this), this)

    return Object.defineProperty(clone, 'axios', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: axios.create(options)
    })
  }

  static get(url: String, params: Object): Promise {
    return this.axios.get(url, { params })
      .then(res => res.data)
  }

  static fetch(url: String, params: Object): Promise {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(url)
        .then(resolve)
        .catch(() => {
          this.get(url, params)
            .then(data => {
              Cache.write(url, data, resolve)
            })
            .catch(reject)
        })
    })
  }

  static getLimit(...args): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.get(...args)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  static fetchLimit(...args): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetch(...args)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  static fetchLimitCache(...args): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetchCache(...args)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  static fetchCache(url: String, params: Object): Promise {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.isNotExpiredThenRead(url, config.CACHE_DURATION)
        .then(resolve)
        .catch(() => {
          this.fetch(url, params)
            .then(resolve)
            .catch(reject)
        })
    })
  }

}
