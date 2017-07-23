const express = require('express')
const webpack = require('webpack')

const config = require('./webpack.dev.config')
const compiler = webpack(config)

const host = process.env.HOST
const port = process.env.PORT

const options = {
  contentBase: `http://${host}:${port}`,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true }
}

const app = express()

app.use(require('webpack-dev-middleware')(compiler, options))
app.use(require('webpack-hot-middleware')(compiler))

app.listen(port, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port)
  }
})
