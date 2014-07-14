var express  = require('express');
var app      = express();
var http     = require('http');
var socketio = require('socket.io');
var port     = process.env.PORT || 5000;

// During development, socket.io serves the client automatically for us.
// server is an EventEmitter with many available
// events including two versions of listen.
var server  = http.Server(app);

// initialize new instance of socket.io by passing the http server object
var io       = socketio(server); 

// makes it so that the stylesheet is accessible to index.html
app.use(express.static(__dirname + '/public'));

// primitive router
app.get('/', function(req, res) {
  res.sendfile('index.html');
});


var guestNumber = 1;
var connections = {};
var userNames   = [];

/************************** Socket Listeners ************************/

io.on('connection', function(socket) {
  assignGuestName(socket);
  sendOccupantList();
  
  socket.on('disconnect', function(data) {
    var username = socket.username;
    var idx = userNames.indexOf(username);
    userNames.splice(idx, 1);
    delete connections[username];
    sendOccupantList()
    socket.broadcast.emit('departed', { username: username });
  });
  
  socket.on('private message', function(data) {
    if(data.username in connections) {
      connections[data.username].emit('private message', {
        username: socket.username,
        message: data.message
      });
    }
  });
  
  socket.on('chat message', function(msg) {
    var username = socket.username;
    
    // to everyone
    //io.emit('chat message', {username: username,message: msg});
      
    // Broadcast to everyone except socket
    socket.broadcast.emit('chat message', {username: username, message: msg});
  });
});

/******************* Helper Functions ***********************/

function sendOccupantList() {
  io.emit('occupants', { usernames: userNames});
}

function assignGuestName(socket) {
  var name = 'guest' + guestNumber++;
  userNames.push(name);
  socket.username = name;
  connections[socket.username] = socket;
  socket.emit('nameResult', {success: true, name: name});
  socket.broadcast.emit('join', name + ' has joined the room.');
}

/**************** Start Server ******************/
server.listen(port, function() {
  console.log('Server listening on port %s', port);
});
