'use strict'

var fs = require('fs')
const readline = require('readline')
const chalk = require('chalk')

var utils = exports

utils.readState = function () {
  return JSON.parse(fs.readFileSync('states.json', 'utf8'))
}

utils.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * Wrapper for system message
 */
utils.systemMsg = function (msg) {
  return chalk.red.bold('System: ') + msg
}

/**
 * Wrapper for system message
 */
utils.printSystem = function (msg) {
  console.log(utils.systemMsg(msg))
}