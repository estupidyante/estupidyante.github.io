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
	// console.log(left, top);
	var clientHeight = this.__clientHeight;
	var clientWidth = this.__clientWidth;

	// Respect zooming
	var mapHeight = this.__contentHeight * zoom;
	var mapWidth = this.__contentWidth * zoom;

	// Compute starting rows/columns and support out of range scroll positions
	var startRow = Math.max(Math.floor(top / mapHeight), 0);
	var startCol = Math.max(Math.floor(left / mapWidth), 0);

	// Compute maximum rows/columns to render for content size
	var maxRows = (this.__contentHeight * zoom) / mapHeight;
	var maxCols = (this.__contentWidth * zoom) / mapWidth;

	var startTop = top >= 0 ? -top % mapHeight : -top;
	var startLeft = left >= 0 ? -left % mapWidth : -left;

	// Compute number of rows to render
	var rows = Math.floor(clientHeight / mapHeight);

	if ((top % mapHeight) > 0) {
		rows += 1;
	}

	if ((startTop + (rows * mapHeight)) < clientHeight) {
		rows += 1;
	}

	// Compute number of columns to render
	var cols = Math.floor(clientWidth / mapWidth);

	if ((left % mapWidth) > 0) {
		cols += 1;
	}

	if ((startLeft + (cols * mapWidth)) < clientWidth) {
		cols += 1;
	}

	// Limit rows/columns to maximum numbers
	rows = Math.min(rows, maxRows - startRow);
	cols = Math.min(cols, maxCols - startCol);

	// Initialize looping variables
	var currentTop = startTop;
	var currentLeft = startLeft;

	mapHeight = mapHeight - 80;

	// Render new squares
	paint(rows, cols, currentLeft, currentTop, mapWidth, mapHeight, zoom);
};