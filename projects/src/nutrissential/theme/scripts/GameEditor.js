//======================= GLOBALS: ===============================
var ngMain = {};
var util = {};
// Initialize viewport
var viewport = document.getElementById('viewporter');
// Initialize canvas access stage object
var content = document.getElementById('gameCanvas');
// Initialize stages
var stage = new Stage(content);
// Initialize containers
var container = new Container(),
	levelContainer = new Container();
// Settings
var context = content.getContext('2d');
var clientWidth = 0;
var clientHeight = 0;
var contentWidth = 2048;
var contentHeight = 2048;
var cellWidth = 2048;
var cellHeight = 2048;
var scroller;

// levelAnimation
var update = true,
	bmpAnim, sparkle,
	imgSeq = new Image();

// Images
var levelBG;
// minimap
var minimap;
// items
var chicken = [],
	itemContainer = new Container(),
	itemX = [50, 1330, 80, 380, 1220],
	itemY = [100, 60, 1380, 70, 530];

// Important Variables
rendering = new Rendering;

// var data = {
// 	images: ['theme/images/worlds/level1/sparkle_21x23.png'],
// 	frames: {width: 21, height: 23, regX: 10, regY: 11}
// }

// bmpAnim = new BitmapAnimation(new SpriteSheet(data));

// editor
var isTarget = false;
var targetContainer = new Container();
var spawnMark = new Bitmap();
var spawnPointsData = [];
var itemLeft, itemTop, itemZoom;
var spawnCount = 0;
//=============================================================


function initMainGame()
{
	// console.log(content);
	util = new GameEngine();
	ngMain = new NGMain();
	ngMain.init();
}

function NGMain()
{
	var THIS = this;

    THIS.init = function()
	{
		// $.get('editor.txt', function readSpawnData(data)
		// {
		// 	spawnItem = data.split("\n");
		// 	spawnCount = spawnItem.length - 1;

		// });

		// Canvas renderer
		var render = function(left, top, zoom) {
			// Sync current dimensions with canvas
		    content.width = clientWidth;
		    content.height = clientHeight;
		    
		    // Full clearing
		    context.clearRect(0, 0, clientWidth, clientHeight);

		    // Use rendering
		    rendering.setup(clientWidth, clientHeight, contentWidth, contentHeight);
		    rendering.render(left, top, zoom, paint);
		};

		// Cell Paint Logic
		var paint = function(row, col, left, top, width, height, zoom) {
			levelContainer.removeChild(levelBG);
			levelContainer.removeChild(sparkle);
			stage.removeChild(levelContainer);

			levelBG = new Bitmap('theme/images/worlds/level1/level1.png');
			levelBG.x = left;
			levelBG.y = top;
			levelBG.scaleX = levelBG.scaleY = zoom;
			
			itemLeft = left;
			itemTop = top;
			itemZoom = zoom;

			levelContainer.addChild(levelBG);

			if (!isTarget)
			{	
				itemContainer.removeAllChildren();
				for(var i = 0; i < spawnPointsData.length; i++) {
					itemContainer.removeChild(chicken[i]);
					itemContainer.removeChild(spawnMark[i]);
					chicken[i] = new Bitmap('theme/images/editor/spawn-placed.png');
					itemContainer.addChild(chicken[i]);
					chicken[i].x = left + (spawnPointsData[i].x * zoom);
					chicken[i].y = top + (spawnPointsData[i].y * zoom);
					chicken[i].scaleX = chicken[i].scaleY = zoom;
					chicken[i].name = 'chicken_' + i;

					levelContainer.addChild(itemContainer);
					stage.update();
				}
			}

			stage.addChild(levelContainer);
			Ticker.addListener(window);
			stage.update();
		};

		// Initialize Scroller
		scroller = new Scroller(render, {
			zooming: false,
			bouncing: false,
			minZoom: 0.39,
			maxZoom: 0.9
		});

		var scrollLeftField = document.getElementById("scrollLeft");
		var scrollTopField = document.getElementById("scrollTop");

		setInterval(function() {
			var values = scroller.getValues();
			scrollLeftField.value = values.left.toFixed(2);
			scrollTopField.value = values.top.toFixed(2);
		}, 500);

		var rect = viewport.getBoundingClientRect();
		scroller.setPosition(rect.left + viewport.clientLeft, rect.top + viewport.clientTop);

		// Reflow handling
		var reflow = function() {
			clientWidth = viewport.clientWidth;
			clientHeight = viewport.clientHeight;
			scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
		};

		window.addEventListener('resize', reflow, false);
		reflow();

		document.querySelector("#scroll-controls #scrollByUp").addEventListener("click", function() {
			scroller.scrollBy(0, -150, true);
		}, false);

		document.querySelector("#scroll-controls #scrollByRight").addEventListener("click", function() {
			scroller.scrollBy(150, 0, true);
		}, false);

		document.querySelector("#scroll-controls #scrollByDown").addEventListener("click", function() {
			scroller.scrollBy(0, 150, true);
		}, false);

		document.querySelector("#scroll-controls #scrollByLeft").addEventListener("click", function() {
			scroller.scrollBy(-150, 0, true);
		}, false);

		// spawn point icon
		document.querySelector("#toolBarIcons #spawnTargetIcon").addEventListener("click", function() {
			if (!isTarget)
			{
				isTarget = true;
				trace('target activated');
				content.style.cursor = 'url(theme/images/cursors/cursor.cur), url(theme/images/cursors/cursor.png), auto';
				this.style.backgroundColor = "#000000";
			}
			else
			{
				isTarget = false;
				trace('target disabled');
				content.style.cursor = 'url(theme/images/cursors/cursor.cur), url(theme/images/cursors/cursor.png), auto';
				this.style.backgroundColor = 'transparent';
			}
			
		}, false);

		if ('ontouchstart' in window) {

			viewport.addEventListener('touchstart', function(e) {
				// Don't react if initial down happens on a form element
				if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
					return;
				}

				scroller.doTouchStart(e.touches, e.timeStamp);
				e.preventDefault();
			}, false);

			document.addEventListener('touchmove', function(e) {
				scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
			}, false);

			document.addEventListener('touchend', function(e) {
				scroller.doTouchEnd(e.timeStamp);
			}, false);

			document.addEventListener('touchcancel', function(e) {
				scroller.doTouchEnd(e.timeStamp);
			}, false);

		} else {

			var mousedown = false;

			// get mosue position
			content.addEventListener('mousemove', function(e) {
				var values = scroller.getValues();
				var mouseXLoc = e.layerX + scroller.getValues().left;
				var mouseYLoc = e.layerY + scroller.getValues().top;
				// trace('mouse x: ' + mouseXLoc);
				// trace('mouse y: ' + mouseYLoc);
				
				$('#tools').html('<p><b>Mouse X: </b>' + Math.round(mouseXLoc) + '</p><p><b>Mouse Y: </b>' + Math.round(mouseYLoc) + '</p>');
				
				$('#sometext').show().html('<div class="ctrCursor" oncontextmenu="return false;" style="position: absolute; z-index: 100; top:' + (e.layerY + 35) + 'px; left:'+ e.layerX + 'px;">' + Math.round(mouseXLoc)  + ',' + Math.round(mouseYLoc) + '</div');
				
				if (e.layerY <= content.offsetTop) {
					// $('#sometext').find('div').css('top', e.layerY + 35);
				}

				if (e.layerY >= content.height - 35) {
					$('#sometext').find('div').css('top', e.layerY - 35);
				}

				if (e.layerX >= content.offsetWidth - 100) {
					$('#sometext').find('div').css({'left': e.layerX - 70, 'top': e.layerY });
					if (e.layerY > 430) {
						$('#sometext').find('div').css('top', e.layerY + 30);
					}
				}
			});
			
			// // set Spawn Points
			// content.addEventListener('onclick', getSpawn);
			content.onclick = getSpawn;
			document.getElementById('genSpawn').onclick = genSpawn;

			viewport.addEventListener('mousedown', function(e) {
				if (e.target.tagName.match(/input|textarea|select/i)) {
					return;
				}
				
				scroller.doTouchStart([{
					pageX: e.pageX,
					pageY: e.pageY
				}], e.timeStamp);

				mousedown = true;
			}, false);

			document.addEventListener('mousemove', function(e) {
				if (!mousedown) {
					return;
				}
				
				scroller.doTouchMove([{
					pageX: e.pageX,
					pageY: e.pageY
				}], e.timeStamp);

				mousedown = true;
			}, false);

			document.addEventListener('mouseup', function(e) {
				if (!mousedown) {
					return;
				}
				
				scroller.doTouchEnd(e.timeStamp);

				mousedown = false;
			}, false);

			// viewport.addEventListener(navigator.userAgent.indexOf('Firefox') > -1 ? 'DOMMouseScroll' :  'mousewheel', function(e) {
			// 	scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
			// }, false);

		}

		if(viewporter.ACTIVE) {
			if(viewporter.isLandscape) {
			    viewport.style.width = '100%';
			    
			    // Initialize Scroller
			    scroller = new Scroller(render, {
			        zooming: false,
			        bouncing: false,
			        minZoom: 0.5,
			        maxZoom: 0.9
			    });
			} else if (viewporter.isPortrait) {
			    viewport.style.height = '100%';

			    // Initialize Scroller
			    scroller = new Scroller(render, {
			        zooming: false,
			        bouncing: false,
			        minZoom: 0.39,
			        maxZoom: 0.9
			    });
			}
			reflow();
		}
	}
}

function addSparkles(count, x, y, speed) {
	//create the specified number of sparkles
	for (var i = 0; i < count; i++) {
		// clone the original sparkle, so we don't need to set shared properties:
		var sparkle = bmpAnim.clone();

		// set display properties:
		sparkle.x = x;
		sparkle.y = y;
		//sparkle.rotation = Math.random()*360;
		sparkle.alpha = Math.random()*0.5+0.5;
		sparkle.scaleX = sparkle.scaleY = Math.random()+0.3;

		// set up velocities:
		var a = Math.PI*2*Math.random();
		var v = (Math.random()-0.5)*30*speed;
		sparkle.vX = Math.cos(a)*v;
		sparkle.vY = Math.sin(a)*v;
		sparkle.vS = (Math.random()-0.5)*0.2; // scale
		sparkle.vA = -Math.random()*0.05-0.01; // alpha

		// start the animation on a random frame:
		sparkle.gotoAndPlay(Math.random()*sparkle.spriteSheet.getNumFrames()|0);

		// add to the display list:
		levelContainer.addChild(sparkle);
	}
}

function getSpawn(e)
{
	var values = scroller.getValues();
	var mouseXLoc = e.layerX + scroller.getValues().left;
	var mouseYLoc = e.layerY + scroller.getValues().top;
	// trace('mouse x: ' + mouseXLoc);
	// trace('mouse y: ' + mouseYLoc);
	var spawnX = Math.round(mouseXLoc);
	var spawnY = Math.round(mouseYLoc);

	if (isTarget)
	{
		spawnPointsData.push({"x" : spawnX, "y" : spawnY});
		console.log(spawnPointsData);
		// var data = JSON.encode(spawnPointsData);

		spawnMark = new Bitmap('theme/images/editor/spawn-placed.png');
		spawnMark.x = itemLeft + (mouseXLoc * itemZoom);
		spawnMark.y = itemTop + (mouseYLoc * itemZoom);
		spawnMark.scaleX = spawnMark.scaleY = itemZoom;

		spawnCount = spawnCount + 1;
		$('#icons').html('<p><b>Spawn Count: </b>' + spawnCount + '</p>');
		itemContainer.addChild(spawnMark);
		levelContainer.addChild(itemContainer);
		stage.addChild(levelContainer);
		stage.update();
	}
	
}

function tick() {
	// loop through all of the active sparkles on stage:
	var l = stage.getNumChildren();
	for (var i=l-1; i>0; i--) {
		sparkle = stage.getChildAt(i);

		// apply gravity and friction
		sparkle.vY += 2;
		sparkle.vX *= 0.98;

		// update position, scale, and alpha:
		sparkle.x += sparkle.vX;
		sparkle.y += sparkle.vY;
		sparkle.scaleX = sparkle.scaleY = sparkle.scaleX+sparkle.vS;
		sparkle.alpha += sparkle.vA;

		//remove sparkles that are off screen or not invisble
		if (sparkle.alpha <= 0 || sparkle.y > content.height) {
			stage.removeChildAt(i);
		}
	}

	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update();
	}
}

// dinagdag ni jay
function genSpawn() {

	if(!isTarget && spawnPointsData.length) {
		var data = JSON.stringify(spawnPointsData);
		
		$.ajax({
			url: 'editor.php',
			type: 'POST',
			data: { data: data },
			success: function (result)
			{
				console.log(result);
			},
			error: function (result)
			{
				console.log(result);
			}
		});

	}

}