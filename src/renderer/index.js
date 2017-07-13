const {IS} = require('../config')

if (IS.DEV) {
  const electronHot = require('electron-hot-loader')
  electronHot.install({highOrderFunctions: ['connect']})
  electronHot.watchJsx(['src/renderer/**/*.js'])
  electronHot.watchCss(['static/css/*.css'])

  require('babel-register')
}

new (require('./main'))
