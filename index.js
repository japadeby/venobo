/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname + '/src')
  require('babel-register')
  require('./src/main')
} else {
  require('./build/main')
}
