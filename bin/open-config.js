#!/usr/bin/env node

const config = require('../src/config')
const open = require('open')
const path = require('path')

open(path.join(config.PATH.CONFIG, 'config.json'))
