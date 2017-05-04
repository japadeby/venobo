/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

if (process.env.NODE_ENV === 'test') {
  require('electron-reload')(__dirname + '/src')
  require('babel-register')
  require('./src/main')
} else {
  require('./dist/main')
}
