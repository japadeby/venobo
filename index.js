/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

const config = require('./src/config')

if (config.IS.DEV) {
  require('electron-compile').init(__dirname, require.resolve('./src/main'))
} else {
  require('./build/main')
}
