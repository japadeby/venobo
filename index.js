/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

const config = require('./config')

if (!config.IS.PRODUCTION) {
  require('babel-register')
  require('electron-reload')(__dirname + '/src')
  require('./main')
} else {
  require('./dist/main')
}
