/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

const path = require('path')

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(path.join(__dirname, 'src', 'main'))
  require('babel-register')

  new (require('./src/main'))
} else {
  new (require('./build/main'))
}
