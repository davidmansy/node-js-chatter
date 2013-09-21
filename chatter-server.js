var socket = require('socket.io');
var express = require('express');
var app = express.createServer();
var io = socket.listen(app);

io.socket.on('connection', function(client) {
	console.log("Client connection");
});