import State from './state'
import HTTP from '../utils/http'

export default function (iso: String, callback: Function) {
  HTTP.get(`${config.APP.API}/translation/${iso}`, (data) => {
    callback(data, iso)
  })
}
