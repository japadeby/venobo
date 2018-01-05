require('babel-polyfill')

// Webpack config for development
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { ReactLoadablePlugin } = require('react-loadable/webpack')
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')

const paths = require('../paths')
const helpers = require('../helpers')
const port = process.env.WEBPACK_PORT || 9000
const publicPath = `http://localhost:${port}/dist/`

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('../webpack-isomorphic-tools'))

const babelrc = fs.readFileSync(paths.appBabelrc)
var babelrcObject = {}

try {
  babelrcObject = JSON.parse(babelrc)
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.')
  console.error(err)
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {}

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || []
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins)

var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectDevelopment, { plugins: combinedPlugins })
delete babelLoaderQuery.env

var validDLLs = helpers.isValidDLLs('vendor', path.appPublicDist)
if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0'
  console.warn('webpack dlls disabled')
}

const webpackConfig = module.exports = {
  devtool: 'inline-source-map',
  target: 'electron-renderer',
  context: paths.appDir,
  entry: [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    paths.appRenderer
  ],
  output: {
    path: path.appPublicDist,
    filename: '[hash].js',
    chunkFilename: '[chunkhash].js',
    publicPath
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'happypack/loader?id=js',
        include: [paths.appRenderer]//, paths.appEngine
        //options: babelLoaderQuery
      }, {
        test: /\.json$/,
        loader: 'happypack/loader?id=json',
        //include: [path.resolve(__dirname, '..')]
      }, {
        test: /\.css/,
        loader: 'happypack/loader?id=css',
      }, {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.less$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
          limit: 10240
        },
      },
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      }
    ]
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.NamedModulesPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    /*new webpack3.ContextReplacementPlugin(
      path.resolve(__dirname, '..', 'src', 'containers')
    ),*/
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DLLS__: JSON.stringify(process.env.WEBPACK_DLLS),
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),
    webpackIsomorphicToolsPlugin.development(),

    new ReactLoadablePlugin({
      filename: path.join(paths.appPublicDist, 'loadable-chunks.json')
    }),

    helpers.createHappyPlugin('js', [
      {
        loader: 'react-hot-loader/webpack'
      }, {
        loader: 'babel-loader',
        options: babelLoaderQuery
      }
    ]),
    helpers.createHappyPlugin('json', [
      { loader: 'json-loader' }
    ]),
    helpers.createHappyPlugin('css', [
      { loader: 'style-loader' },
      { loader: 'css-loader' }
    ])
  ],

  node: {
    __dirname: false,
    __filename: false
  }
}

if (process.env.WEBPACK_DLLS && validDLLs) {
  helpers.installVendorDLL(webpackConfig, 'vendor')
}
