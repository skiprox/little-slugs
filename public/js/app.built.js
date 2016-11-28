(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./painting.js":2}],2:[function(require,module,exports){
'use strict';

function Painting(autoDraw) {
	this.setup(autoDraw);
	this.addListeners();
}

var proto = Painting.prototype;

proto.setup = function(autoDraw) {
	this.autoDraw = typeof autoDraw === 'undefined' ? true : autoDraw;
	this.colorSwitchCount = 0;
	this.canvas = document.getElementById('canvas');
	this.update();
	this.ctx = this.canvas.getContext('2d');
	this.ctx.fillStyle = 'rgb(0, 0, 0)';
	this.ctx.fillRect(0, 0, this.width, this.height);
	// Bind listeners
	this.update = this.update.bind(this);
	this._onMousemove = this._onMousemove.bind(this);
	this._onMouseClick = this._onMouseClick.bind(this);
	this._onKeydown = this._onKeydown.bind(this);
};

proto.addListeners = function() {
	window.addEventListener('resize', this.update);
	this.canvas.addEventListener('click', this._onMouseClick);
	document.addEventListener('keydown', this._onKeydown);
	if (this.autoDraw) {
		this.canvas.addEventListener('mousemove', this._onMousemove);
	}
};

proto.update = function() {
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

proto._onMousemove = function(e) {
	this.drawPainting(e.pageX, e.pageY);
};

proto._onMouseClick = function(e) {
	this.colorSwitchCount = (this.colorSwitchCount + 1) % 3;
};

proto._onKeydown = function(e) {
	if (e.keyCode === 32) {
		this.ctx.fillStyle = 'rgb(0, 0, 0)';
		this.ctx.fillRect(0, 0, this.width, this.height);
	}
};

proto.drawPainting = function(xPos, yPos) {
	var rgbString;
	this.ctx.beginPath();
	this.ctx.arc(xPos, yPos, 50, 0, 2 * Math.PI, false);
	switch(this.colorSwitchCount) {
		case 0:
			rgbString = 'rgb(' + Math.floor((xPos/this.width)*255) + ', ' + Math.floor((yPos/this.height)*255) + ', 100)';
			break;
		case 1:
			rgbString = 'rgb(100, ' + Math.floor((xPos/this.width)*255) + ', ' + Math.floor((yPos/this.height)*255) + ')';
			break;
		case 2:
			rgbString = 'rgb(' + Math.floor((xPos/this.width)*255) + ', 100,' + Math.floor((yPos/this.height)*255) + ')';
			break;
		default:
			rgbString = 'rgb(' + Math.floor((xPos/this.width)*255) + ', ' + Math.floor((yPos/this.height)*255) + ', 100)';
	}
	this.ctx.fillStyle = rgbString;
	this.ctx.fill();
};

module.exports = Painting;

},{}]},{},[1]);
