//socket.io requires a server so transfrom the express app to a server
var app = require("express")()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

//Express
server.listen(8080);

//Express
app.get('/', function (req, res) {
	console.log("Receiving request");
  res.sendfile(__dirname + '/index.html');
});

//socker
io.sockets.on('connection', function (socket) {
	console.log("Client connected");

	socket.on('messages', function(data) {
		console.log(data);
	});

	/*
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
*/
});