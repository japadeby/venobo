#!/usr/bin/env node

const config = require('../src/config')
const open = require('open')

open(config.PATH.CONFIG)
