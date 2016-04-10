'use strict'

const net = require('net')
const chalk = require('chalk')
const readline = require('readline')
const utils = require('./utils')
const prompt = require('./prompt')
const emoji = require('./emoji')

const HOST = '127.0.0.1'
const PORT = 3000
const STATES = utils.readState()
var user = {}

const DEFAULT_PROMPT = chalk.green.bold('You: ')
const rl = utils.rl

function connect (user) {

  let client = new net.Socket()

  client
    .connect(user.port, user.ip, function() {
      register(client, user)
    })
    .on('data', function(data) {
      try {
        data = JSON.parse(data)
        handleRequest(client, data)
      } catch(e) {
        console.log('error', e)
      }
    })
    .on('error', function(error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(utils.systemMsg('You are trying to connect to a wrong host. Please try again'))
      }
    })
    .on('close', function() {
      console.log(utils.systemMsg('Connection closed'))
      rl.close()
    })
}

/**
 * Chat bar
 */
function chat (client) {
  rl.question(DEFAULT_PROMPT, (answer) => {
    if (isCmd(client, answer)) {
      handleCmd(client, answer)
    } else {
      answer = emoji.emojify(answer)
      // TODO replace emoji can reprint the line
      // process.stdout.clearLine()
      // process.stdout.cursorTo(0)
      // console.log(DEFAULT_PROMPT + answer)

      var request = STATES.sendMsg
      request.msg = answer
      client.write(JSON.stringify(request))
    }

    chat(client)
  })
}

function isCmd (client, string) {
  // TODO combine two methods
  var cmd = {
    // '#exit': client.destroy,
    '#list': true,
    '#emoji': emoji.showFaceEmoji
  }
  return cmd.hasOwnProperty(string)
}

function handleCmd (client, string) {
  var cmd = {
    // TODO exit not working
    // '#exit': client.end,
    '#list': requestList,
    '#emoji': emoji.showFaceEmoji
  }
  cmd[string](client)
}

function requestList (client) {
  var request = STATES.requestUsers
  client.write(JSON.stringify(request))
}

/**
 * Register user to server
 */
function register (client, user) {
  var request = STATES.registerRequest
  request.data = user
  client.write(JSON.stringify(request))
}

/**
 * Handle request through opcode
 */
function handleRequest (client, request) {
  switch(request.code){
    /**
     * Register success
     */
    case 1:
      console.log(chalk.green.bold('Connected to: ' + HOST + ':' + PORT))
      console.log('=====================================')
      chat(client)
      break;
    /**
     * Register fail
     */
    case 2:
      console.log(request.msg)
      prompt.askName(function (answer) {
        user.username = answer
        register(client, user)
      })
      break;
    case 3:
      /**
       * Recieve msg
       */
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      console.log('' + request.msg)
      process.stdout.write(DEFAULT_PROMPT)
      break;
    /**
     * Request user list success
     */
    case 7:
      /**
       * Recieve msg
       */
      process.stdout.clearLine()
      process.stdout.cursorTo(0)

      var list = chalk.underline.magenta.bold('\nPeople in chat room:\n')
      for (var i = 0; i < request.data.length; i++) {
       list += request.data[i] + '  '
      }
      list += '\n\n'
      process.stdout.write(list + DEFAULT_PROMPT)
      break;
  }
}

prompt.askEssential(function (user) {
  connect(user)
})

// prompt.askName(function (answer) {
//   var user = {
//     ip: '127.0.0.1',
//     port: '3000',
//     username: answer
//   }
//   connect(user)
// })