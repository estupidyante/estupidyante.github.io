/*=======================================================================
MapRender.js -- level render after we declare it a scrollable

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
========================================================================*/
Rendering = function() {};

Rendering.prototype.setup = function(clientWidth, clientHeight, contentWidth, contentHeight) {
	this.__clientWidth = clientWidth;
	this.__clientHeight = clientHeight;
	this.__contentWidth = contentWidth;
	this.__contentHeight = contentHeight;
};

Rendering.prototype.render = function(left, top, zoom, paint) {
	var clientHeight = this.__clientHeight;
	var clientWidth = this.__clientWidth;

	// // Respect zooming
	var mapHeight = this.__contentHeight * zoom;
	var mapWidth = this.__contentWidth * zoom;

	var startTop = top >= 0 ? -top % mapHeight : -top;
	var startLeft = left >= 0 ? -left % mapWidth : -left;

	// Initialize looping variables
	var currentTop = startTop;
	var currentLeft = startLeft;

	paint(currentLeft, currentTop, mapWidth, mapHeight, zoom);
};