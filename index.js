var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var App = (function() {

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
			console.log('we connected to io on backend');
			socket.on('mouse move', function(data) {
				console.log('we are getting a mousemove event from the front end');
				io.emit('mouse move', {
					xPos: data.xPos,
					yPos: data.yPos
				});
			});
		});
	};

	var listen = function() {
		app.listen(app.get('port'), function() {
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


