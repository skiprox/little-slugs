'use strict';

var socket = io();
var Painting = require('./painting.js');

var Public = (function() {

	// The shared painting object
	var SharedPainting;

	// The UI elements
	var UI = {
		body: null,
		canvas: null,
		userList: null
	};

	var initialize = function() {
		SharedPainting = new Painting(false);
		storeElements();
		addDomListeners();
		addSocketListeners();
	};

	var storeElements = function() {
		UI.body = document.body;
		UI.canvas = document.getElementById('canvas');
		UI.userList = document.getElementById('user-list');
	};

	var addDomListeners = function() {
		UI.canvas.addEventListener('mousemove', function(e) {
			socket.emit('mouse move', {
				xPos: e.pageX,
				yPos: e.pageY
			});
		});
		UI.canvas.addEventListener('touchmove', function(e) {
			if (e.touches) {
				socket.emit('mouse move', {
					xPos: e.touches[0].pageX,
					yPos: e.touches[0].pageY
				});
			}
		});
	};

	var addSocketListeners = function() {
		socket.on('mouse move', function(data) {
			onMousemove(data);
		});
		socket.on('add user', function(data) {
			updateUsers(data);
		});
		socket.on('drop user', function(data) {
			updateUsers(data);
		});
	};

	var onMousemove = function(data) {
		SharedPainting.drawPainting(data.xPos, data.yPos);
	};

	var updateUsers = function(data) {
		UI.userList.textContent = 'Users: ' + data.users;
	};

	return {
		init: function() {
			initialize();
		}
	}

}());

Public.init();