'use strict'

const NET = require('net')
const _ = require('lodash')
const chalk = require('chalk')
const utils = require('./utils')
const STATES = utils.readState()
var HOST = '127.0.0.1'
var PORT = 3000

var users = {}

runServer()

/**
 * Run the chat server
 */
function runServer () {
  NET.createServer(function(sock) {
    var begin = sock
    var id = sock.remoteAddress +':'+ sock.remotePort
    utils.printSystem('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort)

    sock
      .on('data', function(data) {

        try {
          data = JSON.parse(data)
          handleRequest(users, data, sock)
        } catch(e) {
          utils.printSystem('error', e)
          var state = STATES.error
          state.error = e
          sock.write(JSON.stringify(state))
        }
      })
      .on('close', function(data) {
        if (isRegister(users, id)) {
          notify(utils.systemMsg(users[id].user.username + ' has left.'), sock)
          delete users[id]
        }
        utils.printSystem('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort)
      })

  }).listen(PORT, HOST)

  utils.printSystem('Server listening on ' + HOST +':'+ PORT)
}

/**
 * Handle all requests on server
 */
function handleRequest (users, request, sock) {
  var id = sock.remoteAddress +':'+ sock.remotePort
  switch(request.code){
    // Register user
    case 0:
      if (!isRegister(users, id)) {
        try {
          register(users, request.data, sock)
          // Success: send msg to the user and notify all others
          sock.write(JSON.stringify(STATES.registerSuccess))
          notify(utils.systemMsg(request.data.username + ' has joined.'), sock)
        } catch(e) {
          // Fail: notify the user
          var state = STATES.registerFail
          state.msg = utils.systemMsg(e)
          sock.write(JSON.stringify(state))
        }
      }
      break;
    // Send msg
    case 3:
      // Distribute msg to all users
      var msg = chalk.blue.bold(users[id].user.username) + ': ' + request.msg
      notify(msg, sock)
      break;
    // User request users list
    case 6:
      var list = []
      _.forEach(users, function(value, key) {
        if (key === id) {
          list.push(chalk.green.bold(value.user.username))
        } else {
          list.push(chalk.yellow.bold(value.user.username))
        }
      })
      var state = STATES.requestUsersSuccess
      state.data = list
      sock.write(JSON.stringify(state))
      break;
    default:
      // sock.write(JSON.stringify(STATES.registerSuccess))
      break;
  }
     
}

/**
 * Send message to all observers if sock is not specified
 * Send message to all but sock if it is specified
 */
function notify (msg, sock) {
  var state = STATES.sendMsg
  state.msg = msg
  let id = null
  if (sock) {
    id = sock.remoteAddress +':'+ sock.remotePort
  }
  
  for (var key in users) {
    if (key !== id) {
      users[key].socket.write(JSON.stringify(state))
    }
  }
}

function register (users, data, sock) {
  var id = sock.remoteAddress +':'+ sock.remotePort
  var index = getIndexByUsername(users, data.username)
  // if no send an error
  if (index !== undefined) {
    throw  'Username "' + data.username + '" has been used.'
 } else {
  users[id] = {
    socket: sock,
    user: data
  }
}
}

/**
 * 
 */
function getIndexByUsername (users, username) {
  return _.findKey(users, function(o) {return o.user.username === username; })
}

/**
 * Check if a user exist
 */
function isRegister (users, id) {
  return users[id] && users[id].user
}

