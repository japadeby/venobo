const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HappyPack = require('happypack')
const paths = require('./paths')
const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

exports.createHappyPlugin = (id, loaders) => {
  return new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool
  })
}

exports.installVendorDLL = (config, dllName) => {
  const manifest = loadDLLManifest(paths.webpackDll(dllName))

  if (manifest) {
    console.log(`Webpack: will be using the ${dllName} DLL.`)

    config.plugins.push(new webpack.DllReferencePlugin({
      context: projectRootPath,
      manifest: manifest
    }))
  }
}

function loadDLLManifest(filePath) {
  try {
    return require(filePath)
  }
  catch (e) {
    process.env.WEBPACK_DLLS = '0'

    console.error(`========================================================================
  Environment Error
------------------------------------------------------------------------
You have requested to use webpack DLLs (env var WEBPACK_DLLS=1) but a
manifest could not be found. This likely means you have forgotten to
build the DLLs.
You can do that by running:
    npm run build-dlls
The request to use DLLs for this build will be ignored.`)
  }

  return undefined
}

exports.isValidDLLs = (dllNames, assetsPath) => {
  for (var dllName of [].concat(dllNames)) {
    try {
      var manifest = require(paths.webpackDll(dllName))
      var dll = fs.readFileSync(paths.publicWebpackDll(dllName)).toString('utf-8')
      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`Invalid dll: ${dllName}`)
        return false
      }
    } catch (e) {
      return false
    }
  }
  return true
}
