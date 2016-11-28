var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var App = (function() {

	var userCount = 0;

	var setup = function() {
		app.set('port', (process.env.PORT || 5000));
		app.use(express.static(__dirname + '/public'));
		// views is directory for all template files
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.get('/', function(request, response) {
			response.render('pages/index');
		});
	};

	var onIO = function() {
		io.on('connection', function(socket) {
			userCount++;
			io.emit('add user', {
				users: userCount
			});
			socket.on('mouse move', function(data) {
				io.emit('mouse move', {
					xPos: data.xPos,
					yPos: data.yPos
				});
			});
			socket.on('disconnect', function() {
				userCount--;
				io.emit('drop user', {
					users: userCount
				});
			});
		});
	};

	var listen = function() {
		http.listen(app.get('port'), function() {
			console.log('Node app is running on port', app.get('port'));
		});
	};

	return {
		init: function() {
			setup();
			onIO();
			listen();
		}
	}

}());

App.init();


