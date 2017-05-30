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
  
  static setState(state) {
    this.Limiter = new RateLimiter(3, 1000) // limit 3 requests every 1 second
    this.Cache = state.cache
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

  static fetchLimit(url: String): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetch(url)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  static fetchLimitCache(url: String): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetchCache(url)
          .then(resolve)
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
