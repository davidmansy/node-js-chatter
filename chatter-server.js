//socket.io requires a server so transfrom the express app to a server
var app = require("express")()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , messages = [{nickname: "Jim", message: "I believe I can fly"}];

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
		//When client joins, store the nickname and broadcast a message "client joined the chat" to all clients
		client.set('nickname', nickname);
		client.broadcast.emit('chat', nickname + "joined the chat");

		//Then send all existing message to the new joined client
		messages.forEach(function(message) {
			client.emit('messages', message.nickname + ": " + message.message);
		});

	});

	client.on('messages', function(message) {
		//When a client sends a message, first gets his nickname
		client.get('nickname', function(err, nickname) {
			//Then store the message in the array and broadcast the client message to all clients
			storeMessage(nickname, message);
			client.broadcast.emit('chat', nickname + ": " + message);
		});
	});

});

function storeMessage(nickname, message) {
	messages.push({nickname: nickname, message: message});
	if (messages.length > 10) {
		messages.shift();
	}
}