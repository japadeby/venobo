import express from 'express'
import webpack from 'webpack'
import path from 'path'

import config from './webpack.config.renderer.dev'

const port = process.env.WEBPACK_PORT || 9000
const compiler = webpack(config)
const app = express()

const serverOptions = {
  contentBase: path.join(process.cwd(), 'dist'),//`http://${host}:${port}`,
  compress: true,
  quiet: false,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/,
    poll: 100
  },
  historyApiFallback: true
}

app.use(require('webpack-dev-middleware')(compiler, serverOptions))
app.use(require('webpack-hot-middleware')(compiler))

app.listen(port, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port)
  }
})
