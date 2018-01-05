/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import axios, { CancelToken } from 'axios'
import { RateLimiter } from 'limiter'

import HttpSources from './sources'
import { CACHE as Cache, CACHE_DURATION } from '../../../config'

export default class Http {

  limiter: Object
  axios: Object
  //source: Object

  constructor(options: Object = {}) {
    //const source = CancelToken.source() // Ability to cancel API call on route change
    this.axios = axios.create({
      ...options,
      //cancelToken: source.cancelToken
    })
    this.limiter = new RateLimiter(3, 1000) // limit 3 requests every 1 second

    //HttpSources.add(source)
  }
  
  static get(url: String, params: Object = {}): Promise {
    const source = CancelToken.source()
    HttpSources.add(source)

    return axios.get(url, {
      params,
      cancelToken: source.token
    }).then(res => {
      HttpSources.remove(source)

      return res.data
    }).catch(err => {
      HttpSources.remove(source)

      return err
    })
  }

  get(url: String, params: Object = {}): Promise {
    const source = CancelToken.source()
    HttpSources.add(source)

    return this.axios.get(url, {
      params,
      cancelToken: source.token
    }).then(res => {
      HttpSources.remove(source)

      return res.data
    }).catch(err => {
      HttpSources.remove(source)

      return err
    })
  }

  fetch(url: String, params: Object): Promise {
    const cacheId = JSON.stringify({ url, params })

    return new Promise((resolve, reject) => {
      Cache.existsThenRead(cacheId)
        .then(resolve)
        .catch(() => {
          this.get(url, params)
            .then(data => Cache.write(url, data, resolve))
            .catch(reject)
        })
    })
  }

  fetchLimit(...args): Promise {
    return new Promise((resolve, reject) => {
      this.limiter.removeTokens(1, (err, remaining) => {
        this.get(...args)
          .then(resolve)
          .catch(reject)
      })
    })
  }

  fetchLimitCache(...args): Promise {
    return new Promise((resolve, reject) => {
      this.limiter.removeTokens(1, (err, remaining) => {
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
          return this.fetch(url, params)
            .then(resolve)
            .catch(reject)
        })
    })
  }

}
