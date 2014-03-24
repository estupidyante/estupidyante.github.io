/*=======================================================================
Items.js -- item icon for HUD

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.19.2012
========================================================================*/
(function (window){

	var instance;
	var icon = [];
	var iconArray = [];
	var sprite = new SpriteLoader();
	var stack = null;
	var iconName = null;
	var h = 0;

        // TOP LEVEL CLASS
        var Items = function(container, type, xPos, yPos)
        {
                this.initialize(container, type, xPos, yPos);
        }

        // PROTOTYPE INHERITANCE // REQUIRED
        Items.prototype = new Container();
        Items.prototype.Container_initialize = Items.prototype.initialize;
        Items.prototype.Container_tick = Items.prototype._tick;

        // REGISTER EVENT CALLBACKS
	    Items.prototype.iconBody = null;
	    Items.prototype.type = null;
	    Items.prototype.isEnabled = true;

        // PUBLIC METHODS
        Items.prototype.initialize = function(container, type, xPos, yPos)
        {
        		instance = this;

                // REQUIRED
                this.Container_initialize();

                var iconText = null;
                var iconStack = null;
                this.type = type;
		        this.xPos = xPos;
				this.yPos = yPos;

				// DO YOUR MAGIC HERE
                var items = ngMain.itemsData;
                // var items = ItemCombination.get(util.DATA_URL + util.itemsJSON, util.DATA_URL + util.spawnJSON);
                
                var size = Object.size(items);
                for ( item in items)
				{
					stack = items[item].stack;

					if ( type == "icon")
					{
						// console.log('icon stack: ' + stack);
						var iconBody = new Container();
						iconName = item.slice(item.indexOf("_") + 1, item.length);
						
						// place item name
						var strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 2 }];
			            iconText = new TextStroke(iconName, "12px Bowlby One SC", strokes, "center");
			            iconText.x = Number(this.xPos) + 20;
			            iconText.y = Number(this.yPos) + 40;

			            // place item stack
			            strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
			            iconStack = new TextStroke(stack, "20px Bowlby One SC", strokes, "center");
			            iconStack.x = Number(this.xPos) + 40;
			            iconStack.y = Number(this.yPos) - 10;

			            // place item icon
			           	icon[h] = sprite.frame(items[item].piece);
						icon[h].x = Number(this.xPos);
						icon[h].y = Number(this.yPos);
						icon[h].name = iconName;

						iconArray.push(icon[h].name);
						(function(target) {
	                        icon[h].onPress = function(evt) {
	                            
	                        }
	                        icon[h].onMouseOver = function() {
								target.scaleX = target.scaleY = 1.07;
							}
							icon[h].onMouseOut = function() {
								target.scaleX = target.scaleY = 1;
							}
	                    })(icon[h]);

			            iconBody.addChild(icon[h]);
						iconBody.addChild(iconText);
						iconBody.addChild(iconStack);

						container.addChild(iconBody);

						this.xPos = this.xPos + 60;
					}

				}
                

        }

        Items.prototype._tick = function()
        {
                this.Container_tick();
        }


        // REVEAL CLASS TO WINDOW
        window.Items = Items;

})(window);