const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

const host = process.env.HOST
const port = process.env.PORT

function getBabelLoader() {
  const babelrc = fs.readFileSync(path.join(__dirname, '..', '.babelrc'), 'utf-8')

  let options
  try {
    options = JSON.parse(babelrc)
  } catch (err) {
    throw new Error('==>     ERROR: Error parsing your .babelrc. %s', err)
  }

  return {
    loader: 'babel-loader',
    options
  }
}

module.exports = {
  devtool: 'inline-source-map', // eval-source-map
  entry: {
    renderer: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      'react-hot-loader/patch',
      path.join(__dirname, '..', 'src', 'renderer')
    ]
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    publicPath: `http://${host}:${port}`
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '..', 'src', 'renderer'),
        loader: getBabelLoader()
      }, {
        test: /\.css$/,
        include: path.join(__dirname, '..', 'static', 'css'),
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  target: 'electron-renderer'
}
