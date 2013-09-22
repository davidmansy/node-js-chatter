var socket = require('socket.io');
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log("Listening on " + port);
});

io.sockets.on('connection', function(client) {
	console.log("Client connected");
});