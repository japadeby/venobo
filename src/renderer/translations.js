import Preferences from '../preferences'
import HTTP from './utils/http'

export default function (callback: Function) {
  Preferences.get('language', (iso) => {
    HTTP.get(`${config.APP.API}/translation/${iso}`, (data) => {
      callback(data, iso)
    })
  })
}
