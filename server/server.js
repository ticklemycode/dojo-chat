/** Un-comment to run as a standalone service */
const io = require('socket.io')(80)

const EVENTS = require('./events');
const moment = require('moment');

let usernames = [];

/**
 * START for Express Server 
 * 
 *
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3000;

// cors
app.use(cors());

// Routing
app.use(express.static(path.join(__dirname, '../app/')));

// get current active users
app.get('/users', (req, res)=> {
  res.send(usernames);
})

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
*/
/** 
 * 
 * END for Express Server */


console.log('server running, waiting for user to connect...');

// SOCKET MAIN CONNECTION EVENT
io.on('connection', (socket) => {

  console.log('new user connected =)');
  
  // client emits new message event
  socket.on(EVENTS.SEND_MESSAGE, (data) => {
    data['username'] = socket.username;
    data['time'] = moment().format('LT');

    // server sends new message to everyone 
    io.sockets.emit(EVENTS.NEW_MESSAGE, data);
  });

  // client emits new user event
  socket.on(EVENTS.NEW_USER, (username, cb) => {
    // check if username is taken
    if (usernames.includes(username)) {
      return cb(false);
    } else {
      cb(true);
      socket.username = username;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  // when a user disconnects
  socket.on(EVENTS.DISCONNECT, (data) => {
    if(!socket.username) {
      return false;
    }

    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });


  /**
   * updateUsernames
   * emit updated list of usernames to client apps
   */
  function updateUsernames() {
    io.sockets.emit(EVENTS.SEND_USERNAMES, usernames);
  }
});

