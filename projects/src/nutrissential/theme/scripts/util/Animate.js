/*=======================================================================
Animate.js - Library for animation

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
06.15.2012
========================================================================*/
/*===========================
	GENERIC ANIMATION CLASS
============================*/
(function(global) {
	var time = Date.now || function() {
		return +new Date();
	};
	var desiredFrames = 60;
	var millisecondsPerSecond = 1000;
	var running = {};
	var counter = 1;

	// Create namespaces
	if (!global.core) {
		global.core = { effect : {} };
	} else if (!core.effect) {
		core.effect = {};
	}

	core.effect.Animate = {

		// Stops the given animation.
		stop: function(id) {
			var cleared = running[id] != null;
			if (cleared) {
				running[id] = null;
			}
			return cleared;
		},

		// Whether the given animation is still running.
		isRunning: function(id) {
			return running[id] != null;
		},

		// Start the animation.
		start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {

			var start = time();
			var lastFrame = start;
			var percent = 0;
			var dropCounter = 0;
			var id = counter++;

			if (!root) {
				root = document.body;
			}

			// Compacting running db automatically every few new animations
			if (id % 20 === 0) {
				var newRunning = {};
				for (var usedId in running) {
					newRunning[usedId] = true;
				}
				running = newRunning;
			}

			// This is the internal step method which is called every few milliseconds
			var step = function(virtual) {
				// Normalize virtual value
				var render = virtual !== true;
				// Get current time
				var now = time();
				// Verification is executed before next animation step
				if (!running[id] || (verifyCallback && !verifyCallback(id))) {
					running[id] = null;
					completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
					return;
				}
				
				if (render) {
					var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
					for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
						step(true);
						dropCounter++;
					}
				}
				// Compute percent value
				if (duration) {
					percent = (now - start) / duration;
					if (percent > 1) {
						percent = 1;
					}
				}
				// Execute step callback, then...
				var value = easingMethod ? easingMethod(percent) : percent;
				if ((stepCallback(value, now, render) === false || percent === 1) && render) {
					running[id] = null;
					completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
				} else if (render) {
					lastFrame = now;
					requestAnimationFrame(step, root);
				}
			};
			// Mark as running
			running[id] = true;
			// Init first step
			requestAnimationFrame(step, root);
			// Return unique animation ID
			return id;
		}
	};
})(this);