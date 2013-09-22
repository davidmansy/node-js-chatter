//socket.io requires a server so transfrom the express app to a server
var express = require("express")
	,	app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

//Express
app.listen(8080);

//Express
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//socker
io.sockets.on('connection', function (socket) {
	console.log("Client connected");

	/*
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
*/
});