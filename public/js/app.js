'use strict';

var socket = io();
var Painting = require('./painting.js');

var Public = (function() {

	// The shared painting object
	var SharedPainting;

	// The UI elements
	var UI = {
		body: null,
		canvas: null
	};

	var initialize = function() {
		storeElements();
		SharedPainting = new Painting(false);
	};

	var storeElements = function() {
		UI.body = document.body;
		UI.canvas = document.getElementById('canvas');
	};

	var addDomListeners = function() {
		UI.canvas.addEventListener('mouse move', function(e) {
			socket.emit('mouse move', {
				xPos: e.pageX,
				yPos: e.pageY
			});
		});
	};

	var addSocketListeners = function() {
		socket.on('mouse move', function(data) {
			onMousemove(data);
		});
	};

	var onMousemove = function(data) {
		console.log('we receive data', data);
		SharedPainting.drawPainting(data.xPos, data.yPos);
	};

	return {
		init: function() {
			initialize();
		}
	}

}());

Public.init();