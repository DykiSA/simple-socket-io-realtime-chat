// include components
var express = require('express');
var http    = require('http');
var app     = express();
// var mysql   = require('mysql');

// create server
var server  = http.createServer(app);
var host = 'localhost', port = 4000;
server.listen(port, host, function () {
	var addr = server.address();
	console.log(('Server running at '+(addr.address+':'+addr.port)));
});

// home route
app.get('/', function(req, res) {
	res.sendFile('./public/demo.html', {root: __dirname});
})

// socket
var socketIO = require('socket.io');
var io = socketIO.listen(server);

// listen socket event
io.sockets.on('connection', function(socket) {
	// this is an user
	console.log('new client:', socket.id);
	// tell other user that new user has connected
	socket.broadcast.emit('user connect', socket.id);

	socket.on('disconnect', function() {
		// tell other user that a user has disconnected
		socket.broadcast.emit('user disconnect', socket.id);
	});


	// listen a new chat by user
	socket.on('chat', function(data, callback) {
		console.log('event chat:', data);
		// send data to all user except this user
		socket.broadcast.emit('new chat', data);

		if (callback !== 'undefined') { // send callback
			callback();
		}
	})
})
