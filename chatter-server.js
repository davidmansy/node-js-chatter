//socket.io requires a server so transfrom the express app to a server
var app = require("express")()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , messages = [];

//Express
server.listen(8080);

//Express
app.get('/', function (req, res) {
	console.log("Receiving request");
  res.sendfile(__dirname + '/index.html');
});

//socket
io.sockets.on('connection', function (client) {
	console.log("Client connected");

	client.on('join', function(nickname) {
		client.set('nickname', nickname);
	});

	client.on('messages', function(messages) {
		storeMessage(message);
	});

});

function storeMessage(message) {
	messages.push(message);
	if (messages.length > 10) {
		messages.shift();
	}
}