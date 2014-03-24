/*=======================================================================
Scroller.js -- transform objects to be scrollable / draggable

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
========================================================================*/
var Scroller;

(function() {
	Scroller = function(callback, options) {
		this.__callback = callback;
		this.options = {
			/** Enable scrolling on x-axis */
			scrollingX: true,
			/** Enable scrolling on y-axis */
			scrollingY: true,
			/** Enable animations for deceleration, snap back, zooming and scrolling */
			animating: true,
			/** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
			bouncing: true,
			/** Enable locking to the main axis if user moves only slightly on one of them at start */
			locking: true,
			/** Enable pagination mode (switching between full page content panes) */
			paging: false,
			/** Enable snapping of content to a configured pixel grid */
			snapping: false,
			/** Enable zooming of content via API, fingers and mouse wheel */
			zooming: true,
			/** Minimum zoom level */
			minZoom: 0.39,
			/** Maximum zoom level */
			maxZoom: 1
		};
		for (var key in options) {
			this.options[key] = options[key];
		}
	};
	
	// Easing Equations (c) 2003 Robert Penner, all rights reserved.
	// Open source under the BSD License.
	
	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeOutCubic = function(pos) {
		return (Math.pow((pos - 1), 3) + 1);
	};

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	var easeInOutCubic = function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		}

		return 0.5 * (Math.pow((pos - 2), 3) + 2);
	};
	
	var members = {
		__isSingleTouch: false,
		__isTracking: false,
		__isGesturing: false,
		__isDragging: false,
		__isDecelerating: false,
		__isAnimating: false,
		__clientLeft: 0,
		__clientTop: 0,
		__clientWidth: 0,
		__clientHeight: 0,
		__contentWidth: 0,
		__contentHeight: 0,
		__snapWidth: 100,
		__snapHeight: 100,
		__refreshHeight: null,
		__refreshActive: false,
		__refreshActivate: null,
		__refreshDeactivate: null,
		__refreshStart: null,
		__zoomLevel: 1,
		__scrollLeft: 0,
		__scrollTop: 0,
		__maxScrollLeft: 0,
		__maxScrollTop: 0,
		__scheduledLeft: 0,
		__scheduledTop: 0,
		__scheduledZoom: 0,
		__lastTouchLeft: null,
		__lastTouchTop: null,
		__lastTouchMove: null,
		__positions: null,
		__minDecelerationScrollLeft: null,
		__minDecelerationScrollTop: null,
		__maxDecelerationScrollLeft: null,
		__maxDecelerationScrollTop: null,
		__decelerationVelocityX: null,
		__decelerationVelocityY: null,

		setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {
			var self = this;
			// Only update values which are defined
			if (clientWidth) {
				self.__clientWidth = clientWidth;
			}

			if (clientHeight) {
				self.__clientHeight = clientHeight;
			}

			if (contentWidth) {
				self.__contentWidth = contentWidth;
			}

			if (contentHeight) {
				self.__contentHeight = contentHeight;
			}

			// Refresh maximums
			self.__computeScrollMax();

			// Refresh scroll position
			self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
			
		},

		setPosition: function(left, top) {
			var self = this;
			self.__clientLeft = left || 0;
			self.__clientTop = top || 0;
		},

		setSnapSize: function(width, height) {
			var self = this;
			self.__snapWidth = width;
			self.__snapHeight = height;
		},

		getValues: function() {
			var self = this;
			return {
				left: self.__scrollLeft,
				top: self.__scrollTop,
				zoom: self.__zoomLevel
			};
		},

		getScrollMax: function() {
			var self = this;
			return {
				left: self.__maxScrollLeft,
				top: self.__maxScrollTop
			};
		},

		zoomTo: function(level, animate, originLeft, originTop) {
			var self = this;
			if (!self.options.zooming) {
				throw new Error("Zooming is not enabled!");
			}
			// Stop deceleration
			if (self.__isDecelerating) {
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			var oldLevel = self.__zoomLevel;

			// Normalize input origin to center of viewport if not defined
			if (originLeft == null) {
				originLeft = self.__clientWidth / 2;
			}

			if (originTop == null) {
				originTop = self.__clientHeight / 2;
			}

			// Limit level according to configuration
			level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

			// Recompute maximum values while temporary tweaking maximum scroll ranges
			self.__computeScrollMax(level);

			// Recompute left and top coordinates based on new zoom level
			var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
			var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;

			// Limit x-axis
			if (left > self.__maxScrollLeft) {
				left = self.__maxScrollLeft;
			} else if (left < 0) {
				left = 0;
			}

			// Limit y-axis
			if (top > self.__maxScrollTop) {
				top = self.__maxScrollTop;
			} else if (top < 0) {
				top = 0;
			}

			// Push values out
			self.__publish(left, top, level, animate);

		},

		zoomBy: function(factor, animate, originLeft, originTop) {
			var self = this;
			self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop);
		},

		scrollTo: function(left, top, animate, zoom) {

			var self = this;
			
			// Stop deceleration
			if (self.__isDecelerating) {
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}
			
			// Correct coordinates based on new zoom level
			if (zoom != null && zoom !== self.__zoomLevel) {
				
				if (!self.options.zooming) {
					throw new Error("Zooming is not enabled!");
				}
				
				left *= zoom;
				top *= zoom;
				
				// Recompute maximum values while temporary tweaking maximum scroll ranges
				self.__computeScrollMax(zoom);
				
			} else {
				
				// Keep zoom when not defined
				zoom = self.__zoomLevel;
				
			}

			if (!self.options.scrollingX) {

				left = self.__scrollLeft;

			} else {

				if (self.options.paging) {
					left = Math.round(left / self.__clientWidth) * self.__clientWidth;
				} else if (self.options.snapping) {
					left = Math.round(left / self.__snapWidth) * self.__snapWidth;
				}

			}

			if (!self.options.scrollingY) {

				top = self.__scrollTop;

			} else {

				if (self.options.paging) {
					top = Math.round(top / self.__clientHeight) * self.__clientHeight;
				} else if (self.options.snapping) {
					top = Math.round(top / self.__snapHeight) * self.__snapHeight;
				}

			}

			// Limit for allowed ranges
			left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
			top = Math.max(Math.min(self.__maxScrollTop, top), 0);

			// Don't animate when no change detected, still call publish to make sure
			// that rendered position is really in-sync with internal data
			if (left === self.__scrollLeft && top === self.__scrollTop) {
				animate = false;
			}
			
			// Publish new values
			self.__publish(left, top, zoom, animate);

		},

		scrollBy: function(left, top, animate) {

			var self = this;

			var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
			var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

			self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);

		},

		doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY) {

			var self = this;
			var change = wheelDelta > 0 ? 0.97 : 1.03;

			return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);

		},

		doTouchStart: function(touches, timeStamp) {

			// Array-like check is enough here
			if (touches.length == null) {
				throw new Error("Invalid touch list: " + touches);
			}

			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}
			
			var self = this;

			// Stop deceleration
			if (self.__isDecelerating) {
				core.effect.Animate.stop(self.__isDecelerating);
				self.__isDecelerating = false;
			}

			// Stop animation
			if (self.__isAnimating) {
				core.effect.Animate.stop(self.__isAnimating);
				self.__isAnimating = false;
			}

			// Use center point when dealing with two fingers
			var currentTouchLeft, currentTouchTop;
			var isSingleTouch = touches.length === 1;
			if (isSingleTouch) {
				currentTouchLeft = touches[0].pageX;
				currentTouchTop = touches[0].pageY;
			} else {
				currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
				currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
			}

			self.__initialTouchLeft = currentTouchLeft;
			self.__initialTouchTop = currentTouchTop;
			self.__zoomLevelStart = self.__zoomLevel;
			self.__lastTouchLeft = currentTouchLeft;
			self.__lastTouchTop = currentTouchTop;
			self.__lastTouchMove = timeStamp;
			self.__lastScale = 1;
			self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
			self.__enableScrollY = !isSingleTouch && self.options.scrollingY;
			self.__isTracking = true;
			self.__isDragging = !isSingleTouch;
			self.__isSingleTouch = isSingleTouch;
			self.__positions = [];

		},

		doTouchMove: function(touches, timeStamp, scale) {

			if (touches.length == null) {
				throw new Error("Invalid touch list: " + touches);
			}
			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}

			var self = this;

			if (!self.__isTracking) {
				return;
			}
			
			var currentTouchLeft, currentTouchTop;

			if (touches.length === 2) {
				currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
				currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
			} else {
				currentTouchLeft = touches[0].pageX;
				currentTouchTop = touches[0].pageY;
			}

			var positions = self.__positions;

			if (self.__isDragging) {

				var moveX = currentTouchLeft - self.__lastTouchLeft;
				var moveY = currentTouchTop - self.__lastTouchTop;
				var scrollLeft = self.__scrollLeft;
				var scrollTop = self.__scrollTop;
				var level = self.__zoomLevel;

				if (scale != null && self.options.zooming) {
					var oldLevel = level;
					level = level / self.__lastScale * scale;
					level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
					if (oldLevel !== level) {
						var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
						var currentTouchTopRel = currentTouchTop - self.__clientTop;
						scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
						scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;
						self.__computeScrollMax(level);
					}
				}

				if (self.__enableScrollX) {
					scrollLeft -= moveX;
					var maxScrollLeft = self.__maxScrollLeft;
					if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
						if (self.options.bouncing) {
							scrollLeft += (moveX / 2);
						} else if (scrollLeft > maxScrollLeft) {
							scrollLeft = maxScrollLeft;
						} else {
							scrollLeft = 0;
						}
					}
				}

				if (self.__enableScrollY) {
					scrollTop -= moveY;
					var maxScrollTop = self.__maxScrollTop;
					if (scrollTop > maxScrollTop || scrollTop < 0) {
						if (self.options.bouncing) {
							scrollTop += (moveY / 2);
							if (!self.__enableScrollX && self.__refreshHeight != null) {
								if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {
									self.__refreshActive = true;
									if (self.__refreshActivate) {
										self.__refreshActivate();
									}
								} else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {
									self.__refreshActive = false;
									if (self.__refreshDeactivate) {
										self.__refreshDeactivate();
									}
								}
							}
						} else if (scrollTop > maxScrollTop) {
							scrollTop = maxScrollTop;
						} else {
							scrollTop = 0;
						}
					}
				}

				if (positions.length > 60) {
					positions.splice(0, 30);
				}
				
				positions.push(scrollLeft, scrollTop, timeStamp);
				self.__publish(scrollLeft, scrollTop, level);

			} else {

				var minimumTrackingForScroll = self.options.locking ? 3 : 0;
				var minimumTrackingForDrag = 5;

				var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
				var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);

				self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
				self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;
				
				positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);

				self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);

			}
			self.__lastTouchLeft = currentTouchLeft;
			self.__lastTouchTop = currentTouchTop;
			self.__lastTouchMove = timeStamp;
			self.__lastScale = scale;

		},

		doTouchEnd: function(timeStamp) {
			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}
			var self = this;
			if (!self.__isTracking) {
				return;
			}

			self.__isTracking = false;

			if (self.__isDragging) {
				self.__isDragging = false;
				if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {
					var positions = self.__positions;
					var endPos = positions.length - 1;
					var startPos = endPos;
					for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
						startPos = i;
					}
					if (startPos !== endPos) {
						var timeOffset = positions[endPos] - positions[startPos];
						var movedLeft = self.__scrollLeft - positions[startPos - 2];
						var movedTop = self.__scrollTop - positions[startPos - 1];
						self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
						self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
						var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;
						if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
							if (!self.__refreshActive) {
								self.__startDeceleration(timeStamp);
							}
						}
					}
				}
			}

			if (!self.__isDecelerating) {

				if (self.__refreshActive && self.__refreshStart) {

					self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);
					
					if (self.__refreshStart) {
						self.__refreshStart();
					}
					
				} else {
					
					self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);
					
					// Directly signalize deactivation (nothing todo on refresh?)
					if (self.__refreshActive) {
						
						self.__refreshActive = false;
						if (self.__refreshDeactivate) {
							self.__refreshDeactivate();
						}
						
					}
				}
			}
			
			// Fully cleanup list
			self.__positions.length = 0;

		},

		__publish: function(left, top, zoom, animate) {

			var self = this;
			
			// Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
			var wasAnimating = self.__isAnimating;
			if (wasAnimating) {
				core.effect.Animate.stop(wasAnimating);
				self.__isAnimating = false;
			}

			if (animate && self.options.animating) {

				// Keep scheduled positions for scrollBy/zoomBy functionality
				self.__scheduledLeft = left;
				self.__scheduledTop = top;
				self.__scheduledZoom = zoom;

				var oldLeft = self.__scrollLeft;
				var oldTop = self.__scrollTop;
				var oldZoom = self.__zoomLevel;

				var diffLeft = left - oldLeft;
				var diffTop = top - oldTop;
				var diffZoom = zoom - oldZoom;

				var step = function(percent, now, render) {

					if (render) {

						self.__scrollLeft = oldLeft + (diffLeft * percent);
						self.__scrollTop = oldTop + (diffTop * percent);
						self.__zoomLevel = oldZoom + (diffZoom * percent);

						// Push values out
						if (self.__callback) {
							self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel);
						}

					}
				};

				var verify = function(id) {
					return self.__isAnimating === id;
				};

				var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
					if (animationId === self.__isAnimating) {
						self.__isAnimating = false;
					}
					
					if (self.options.zooming) {
						self.__computeScrollMax();
					}
				};
				
				// When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
				self.__isAnimating = core.effect.Animate.start(step, verify, completed, 250, wasAnimating ? easeOutCubic : easeInOutCubic);

			} else {

				self.__scheduledLeft = self.__scrollLeft = left;
				self.__scheduledTop = self.__scrollTop = top;
				self.__scheduledZoom = self.__zoomLevel = zoom;

				// Push values out
				if (self.__callback) {
					self.__callback(left, top, zoom);
				}

				// Fix max scroll ranges
				if (self.options.zooming) {
					self.__computeScrollMax();
				}
			}
		},

		__computeScrollMax: function(zoomLevel) {

			var self = this;
			
			if (zoomLevel == null) {
				zoomLevel = self.__zoomLevel;
			}

			self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
			self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);
			
		},

		__startDeceleration: function(timeStamp) {

			var self = this;

			if (self.options.paging) {

				var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
				var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
				var clientWidth = self.__clientWidth;
				var clientHeight = self.__clientHeight;

				// We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
				// Each page should have exactly the size of the client area.
				self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
				self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
				self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
				self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;

			} else {

				self.__minDecelerationScrollLeft = 0;
				self.__minDecelerationScrollTop = 0;
				self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
				self.__maxDecelerationScrollTop = self.__maxScrollTop;

			}

			// Wrap class method
			var step = function(percent, now, render) {
				self.__stepThroughDeceleration(render);
			};

			// How much velocity is required to keep the deceleration running
			var minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;

			// Detect whether it's still worth to continue animating steps
			// If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
			var verify = function() {
				return Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
			};

			var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
				self.__isDecelerating = false;

				// Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
				self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
			};

			// Start animation and switch on flag
			self.__isDecelerating = core.effect.Animate.start(step, verify, completed);

		},

		__stepThroughDeceleration: function(render) {

			var self = this;

			// Add deceleration to scroll position
			var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
			var scrollTop = self.__scrollTop + self.__decelerationVelocityY;

			if (!self.options.bouncing) {

				var scrollLeftFixed = Math.max(Math.min(self.__maxScrollLeft, scrollLeft), 0);
				if (scrollLeftFixed !== scrollLeft) {
					scrollLeft = scrollLeftFixed;
					self.__decelerationVelocityX = 0;
				}

				var scrollTopFixed = Math.max(Math.min(self.__maxScrollTop, scrollTop), 0);
				if (scrollTopFixed !== scrollTop) {
					scrollTop = scrollTopFixed;
					self.__decelerationVelocityY = 0;
				}

			}

			if (render) {

				self.__publish(scrollLeft, scrollTop, self.__zoomLevel);

			} else {

				self.__scrollLeft = scrollLeft;
				self.__scrollTop = scrollTop;

			}

			// Slow down velocity on every iteration
			if (!self.options.paging) {

				var frictionFactor = 0.95;

				self.__decelerationVelocityX *= frictionFactor;
				self.__decelerationVelocityY *= frictionFactor;

			}

			if (self.options.bouncing) {

				var scrollOutsideX = 0;
				var scrollOutsideY = 0;

				var penetrationDeceleration = 0.03;
				var penetrationAcceleration = 0.08;

				// Check limits
				if (scrollLeft < self.__minDecelerationScrollLeft) {
					scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
				} else if (scrollLeft > self.__maxDecelerationScrollLeft) {
					scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
				}

				if (scrollTop < self.__minDecelerationScrollTop) {
					scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
				} else if (scrollTop > self.__maxDecelerationScrollTop) {
					scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
				}

				// Slow down until slow enough, then flip back to snap position
				if (scrollOutsideX !== 0) {
					if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
						self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
					} else {
						self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
					}
				}

				if (scrollOutsideY !== 0) {
					if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
						self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
					} else {
						self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
					}
				}
			}
		}
	};
	
	// Copy over members to prototype
	for (var key in members) {
		Scroller.prototype[key] = members[key];
	}
		
})();