import {APP, PATH} from './config'
import LocalStorage from 'local-storage-es6'

const PrefCache = new LocalStorage(PATH.CONFIG, APP.SECRET_KEY)

export default class Preferences {

  static defaults: Object

  static setup(obj: Object) {
    this.defaults = obj

    PrefCache.existsThenRead(this.name)
      .then(data => {
        if((this.has(obj, data)) === false) {
          PrefCache.writeSync(this.name, obj)
        }
      })
      .catch(() => {
        PrefCache.writeSync(this.name, obj)
      })
  }

  static has(obj: Object, data: Object) {
    for (let i in data) {
      if (!(obj.hasOwnProperty(i))) {
        return false
      }
    }
  }

  static setSync(key: String, value) {
    PrefCache.existsThenRead(this.name)
      .then(data => {
        data[key] = value
        PrefCache.writeSync(this.name, data)
      })
      .catch(console.warn)
  }

  static set(key: String, value, callback: Function) {
    PrefCache.existsThenRead(this.name)
      .then(data => {
        data[key] = value
        PrefCache.write(this.name, data, callback)
      })
      .catch(console.warn)
  }

  static get(key: String, callback: Function) {
    PrefCache.existsThenRead(this.name)
      .then(data => callback(data[key]))
      .catch(console.warn)
  }

  static getSync(key: String) {
    const data = PrefCache.readSync(this.name)
    return data[key]
  }

  static getAll(callback: Function) {
    PrefCache.existsThenRead(this.name)
      .then(callback)
      .catch(console.warn)
  }

  static setDefault() {
    PrefCache.writeSync(this.name, this.defaults)
  }

}
