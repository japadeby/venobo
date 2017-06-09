/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname + '/src')
  require('babel-register')
  new (require('./src/main'))
} else {
  new (require('./build/main'))
}
