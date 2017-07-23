/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

const config = require('./src/config')
const path = require('path')

if (config.IS.DEV) {
  require('babel-register')
  new (require('./src/main'))
} else {
  new (require('./build/main'))
}
