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
	this.ctx = this.canvas.getContext('2d');
	this.update();
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
	this.ctx.fillStyle = 'rgb(0, 0, 0)';
	this.ctx.fillRect(0, 0, this.width, this.height);
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
	this.ctx.arc(xPos, yPos, 40, 0, 2 * Math.PI, false);
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
