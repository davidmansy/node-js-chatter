//socket.io requires a server so transfrom the express app to a server
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , Kaiseki = require('kaiseki')
  , APP_ID = '7zdZqj54MGxLbPW2s7TM3Ys68NVy3MPWOa1RWSJ7'
  , REST_API_KEY = 'Gq1ttuldkzO43EpoIDXb4A74296uq8ly78RrrztA'
  , kaiseki = new Kaiseki(APP_ID, REST_API_KEY);

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

	//JOIN
	client.on('join', function(nickname) {
		//When client joins, store the nickname and broadcast a "add chatter" event with the nickname to all clients
		client.set('nickname', nickname);
		client.broadcast.emit('add chatter', nickname);
		//Store the new chatter in the list of chatters
		var chatter = {};
		chatter.nickname = nickname;

		//Store the new chatter in parse and store the id in the client then emit a "add chatter" event
		kaiseki.createObject('Chatter', chatter, function(err, res, chatter, success) {
		  console.log('object created = ', chatter);
		  console.log('object id = ', chatter.objectId);
		  client.set('id', chatter.objectId);
			//Emit a "add chatter" event for each connected chatters to the client
			kaiseki.getObjects('Chatter', function(err, res, chatters, success) {
			  console.log('all chatters = ', chatters);
				chatters.forEach(function(chatter) {
					client.emit('add chatter', chatter.nickname);
				});
			});
		});

		//Then send all existing message to the newly joined client
		kaiseki.getObjects('Message', function(err, res, messages, success) {
		  console.log('all messages = ', messages);
			messages.forEach(function(message) {
				client.emit('messages', message.nickname + ": " + message.message);
			});
		});

	});

	//RECEIVE A MESSAGE
	client.on('messages', function(message) {

		//When a client sends a message, first gets his nickname
		client.get('nickname', function(err, nickname) {

			//Store the new message in parse then emit a "messages" event to all client
			kaiseki.createObject('Message', message, function(err, res, message, success) {
			  console.log('object created = ', message);
			  console.log('object id = ', message.objectId);

				client.emit('messages', nickname + ": " + message, messages);
				client.broadcast.emit('messages', nickname + ": " + message, messages);
			});

		});

	});

	//DISCONNECT
	//Remove the client when disconnected	￼
	client.on('disconnect', function(name){
		//Retrieve the nickname and emit a "remove chatter" event to the client so that it deletes the chatter from the list
	  client.get('nickname', function(err, name){
	    client.broadcast.emit('remove chatter', name);
	  });

	  //Retrieve the id of the chatter and use it to delete the chatter
	  client.get('id', function(err, id){
			//Delete the chatter
			kaiseki.deleteObject('Chatter', id, function(err, res, body, success) {
			  if (success)
			    console.log('deleted!');
			  else
			    console.log('failed!');
			});
	  });
	});

});
