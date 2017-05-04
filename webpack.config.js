const path = require('path')

module.exports = {
  entry: {
    'main': path.join(__dirname, 'main', 'index.js'),
    'renderer': path.join(__dirname, 'renderer', 'index.js')
  },
  output: {
    path: path.join(__dirname, 'bundles'),
    filename: '[name].js'
  },
  target: 'atom',
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  externals: [
    (function () {
      var IGNORES = [
        'electron'
      ]
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')")
        }
        return callback()
      }
    })()
  ]
}
