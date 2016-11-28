'use strict';

var Painting = require('./painting.js');

var Public = (function() {

	var sharedPainting;

	var initialize = function() {
		console.log('we init');
		sharedPainting = new Painting();
	};

	return {
		init: function() {
			initialize();
		}
	}

}());

Public.init();