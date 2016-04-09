'use strict';

const readline = require('readline')
const chalk = require('chalk')
const rl = require('./utils').rl

var prompt = exports

prompt.askName = function () {
  var cb = getCb(arguments)
  promptConsole('What is your name? ', (answer) => {
    cb(answer)
  })
}

prompt.askIP = function () {
  var cb = getCb(arguments)
  promptConsole('What\'s IP? ', (answer) => {
    if (validateIPaddress(answer)) {
      cb(answer)
    } else {
      error('Invalid ipaddress!')
      prompt.askIP(cb)
    }
  })
}

prompt.askPort = function () {
  var cb = getCb(arguments)
  promptConsole('What\'s port number? ', (answer) => {
    if (validatePort(answer)) {
      cb(answer)
    } else {
      error('Invalid port number!')
      prompt.askPort(cb)
    }
  })
}

prompt.askEssential = function () {
  var cb = getCb(arguments)
  var data = {}
  prompt.askIP(function (answer) {
    data.ip = answer
    prompt.askPort(function (answer) {
      data.port = answer
      prompt.askName(function (answer) {
        data.username = answer
        cb(data)
      })
    })
  })
}


function error(error) {
  console.log(chalk.red.bold(error))
}

function promptConsole(question) {
  var cb = getCb(arguments)
  question = chalk.blue.bold(question)
  rl.question(question, cb)
}

/**
 * Check if this port number is valid
 */
function validatePort(port) {
  if (port > 0 && port < 65535) {
    return true
  }
  return false
}

/**
 * Validate Ip
 */
function validateIPaddress(ipaddress)   
{  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return true 
  } 
  return false
}

/**
 * If the last parameter is a funtion, take it as a callback
 * If not, return empty function
 */
function getCb(parameters) {
  if (typeof parameters[parameters.length-1] !== 'function') {
    return function () {}
  }
  return parameters[parameters.length-1]
}