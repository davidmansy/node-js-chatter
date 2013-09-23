//socket.io requires a server so transfrom the express app to a server
var app = require("express")()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , messages = []
  , chatters = []
  , fs = require('fs')
  , window
  , window.document;

eval(fs.readFileSync('hackreactor_chatbuilder.js')+'');

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
		//When client joins, store the nickname and broadcast the nickname to all clients
		client.set('nickname', nickname);
		client.broadcast.emit('add chatter', nickname);
		//Store the new chatter in the list of chatters
		storeChatter(nickname);
		//Send the list of the connected chatters to the client
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
			//
			send(nickname + ": " + message, messages);
			//
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

function send(str) {
  console.log(str);

  chatbuilder.$.ajax('https://api.parse.com/1/classes/chats', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({'text': str}),
    dataType: 'json',
    success: function(result) {
      console.log(result);
    },
    error: function(request, errorType, errorMessage) {
      console.log('Error: ' + errorType + ' with message ' + errorMessage);
      console.log(str);
    }
  });

}
