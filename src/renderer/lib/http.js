/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import axios from 'axios'
import {RateLimiter} from 'limiter'

import {CACHE as Cache, CACHE_DURATION} from '../../config'

export default class HTTP {

  Limiter: Object
  axios: Object

  constructor(options: Object = {}) {
    this.axios = axios.create(options)
    this.Limiter = new RateLimiter(3, 1000) // limit 3 requests every 1 second
  }

  static get(url: String, params: Object = {}): Promise {
    return axios.get(url, { params: { ...params } })
      .then(res => res.data)
  }

  get(url: String, params: Object = {}): Promise {
    return this.axios.get(url, { params: { ...params } })
      .then(res => res.data)
  }

  fetch(url: String, params: Object): Promise {
    const cacheId = JSON.stringify({url, params})

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(cacheId)
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

  fetchLimit(...args): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetch(...args)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  fetchLimitCache(...args): Promise {
    const {Limiter} = this

    return new Promise((resolve, reject) => {
      Limiter.removeTokens(1, (err, remaining) => {
        this.fetchCache(...args)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  fetchCache(url: String, params: Object): Promise {
    return new Promise((resolve, reject) => {
      Cache.isNotExpiredThenRead(url, CACHE_DURATION)
        .then(resolve)
        .catch(() => {
          this.fetch(url, params)
            .then(resolve)
            .catch(reject)
        })
    })
  }

}
