#!/usr/bin/env node

const config = require('../src/config')
const open = require('open')
const path = require('path')

console.log(config.PATH.CONFIG)

open(path.join(config.PATH.CONFIG, '.json'))
