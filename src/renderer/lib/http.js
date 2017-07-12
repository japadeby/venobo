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

  static create(params) {
    // create new instance
    const http = Object.assign({}, this)

    return Object.defineProperty(http, 'axios', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: axios.create(params)
    })
  }

  static get(url: String, params: Object): Promise {
    return this.axios.get(url, { params })
      .then(res => res.data)
  }

  static fetch(): Promise {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(url)
        .then(resolve)
        .catch(() => {
          this.get(arguments)
            .then(data => {
              Cache.write(url, data, resolve)
            })
            .catch(reject)
        })
    })
  }

  static fetchLimit(): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetch(arguments)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  static fetchLimitCache(): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetchCache(arguments)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  static fetchCache(): Promise {
    const {Cache} = this

    return new Promise((resolve, reject) => {
      Cache.isNotExpiredThenRead(url, config.CACHE_DURATION)
        .then(resolve)
        .catch(() => {
          this.fetch(arguments)
            .then(resolve)
            .catch(reject)
        })
    })
  }

}
