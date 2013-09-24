//socket.io requires a server so transfrom the express app to a server
var app = require("express")()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , messages = []
  , chatters = []
  , Parse = require('node-parse-api').Parse
  , APP_ID = "7zdZqj54MGxLbPW2s7TM3Ys68NVy3MPWOa1RWSJ7"
  , MASTER_KEY = "DvQ7Ifq8YtCemeeIFEkitHS7Tb5pLaJc0gBKS7CR"
  , app = new Parse(APP_ID, MASTER_KEY);

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
		//When client joins, store the nickname and broadcast a "add chatter" event with the nickname to all clients
		client.set('nickname', nickname);
		client.broadcast.emit('add chatter', nickname);
		//Store the new chatter in the list of chatters
		storeChatter(nickname);
		//Emit a "add chatter" event for each connected chatters to the client
		chatters.forEach(function(chatter) {
			client.emit('add chatter', chatter);
		});

		//Then send all existing message to the newly joined client
		messages.forEach(function(message) {
			client.emit('messages', message.nickname + ": " + message.message);
		});

	});

	client.on('messages', function(message) {
		//When a client sends a message, first gets his nickname
		client.get('nickname', function(err, nickname) {
			//Then store the message in the array and broadcast the client message to all clients
			storeMessage(nickname, message);
			client.emit('messages', nickname + ": " + message, messages);
			client.broadcast.emit('messages', nickname + ": " + message, messages);
		});
	});

});

function storeMessage(nickname, message) {
	messages.push({nickname: nickname, message: message});
	if (messages.length > 10) {
		messages.shift();
	}
}

function storeChatter(nickname) {
	chatters.push(nickname);
}