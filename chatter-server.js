var socket = require('socket.io');
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var io = socket.listen(app);
io.sockets.on('connection', function(client) {
	console.log("Client connection");
});