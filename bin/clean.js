#!/usr/bin/env node

/**
 * Remove all traces of Venobo Desktop from the system (config and temp files).
 * Useful for developers.
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')

const config = require('../src/config')

// First, remove generated files
rimraf.sync('build/')
rimraf.sync('dist/')

// Remove any saved configuration
rimraf.sync(config.PATH.CONFIG)
rimraf.sync(config.PATH.CACHE)

// Remove any temporary files
let tmpPath
try {
  tmpPath = path.join(fs.statSync('/tmp') && '/tmp', 'venobo')
} catch (err) {
  tmpPath = path.join(os.tmpdir(), 'venobo')
}
rimraf.sync(tmpPath)
