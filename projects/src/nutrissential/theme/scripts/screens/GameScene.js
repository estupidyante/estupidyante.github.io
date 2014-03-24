/*=======================================================================
GameScene.js - renders level for a specific world

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.13.2012
========================================================================*/
(function (window)
{
    PlayScene.prototype = new Container();
    function PlayScene(worldId)
    {
        var THIS = this;
        THIS.super_initialize = PlayScene.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.VISIBLE_QUEUE = 9;
        THIS.SCALE_STEP = 0.11;
        THIS.Y_STEP = 80;
        THIS.CLOCK_BONUS = 5;
        THIS.BASE_MATCH_SCORE = 100;
        THIS.MAX_SPEED_MATCH_TIME = 350;
        THIS.BOMB_DELAY = 80;

        //states:
        THIS.LEVEL_START = "LEVEL_START";
        THIS.PAUSE = "PAUSE";
        THIS.LIVE = "LIVE";
        THIS.GAME_OVER = "GAME_OVER";
        THIS.BETWEEN = "BETWEEN";

        THIS.startTime;
        THIS.iconTypes = 0;
        THIS.iconsQueue = [];
        THIS.stack = 20;
        THIS.onHold = false;
        THIS.timeLeft = 0;
        THIS.xml;
        THIS.levelTypes;
        THIS.levelStack;
        THIS.currentLevel = 0;
        THIS.addPoint;
        THIS.score = 0;
        THIS.combo = 0;

        THIS.bgLayer = new Container();
        THIS.hudLayer = new Container();
        THIS.sprite = new SpriteLoader();

        THIS.curState = "";
        THIS.prevState = "";
        THIS.pauseStart = null;
        THIS.pauseTime = null;
        THIS.iconImages = [];
        THIS.imagesQueue;
        THIS.pauseButton = null;
        THIS.statsBar = null;
        THIS.wrongSign = null;
        THIS.chance4PowerUp = null;
        THIS.powerUpsData = null;
        THIS.bgBitmap = null;
        THIS.speedMatchCount = 0;
        THIS.lastMatchTime = null;
        THIS.accomulateTime = true;
        THIS.nextLevelPanel = null;
        THIS.spawnPoints = null;
        THIS.spawnCount = 0;
        THIS.piece = [];
        THIS.avatar = null;

        // Initialize viewport
        var gameView = document.getElementById('gameView');
        // Settings
        var clientWidth = 0;
        var clientHeight = 0;
        var contentWidth = 2048;
        var contentHeight = 2048;
        var scroller;

        // Important Variables
        rendering = new Rendering;

/*============================================
*
*   NEW VARIABLE
*
*===========================================*/
        var frontLayer = new Container();
        var mapLayer = new Container();
        var iconBody = new Container();
        var iconBodyStack = new Container();
        var iconAvatar = new Container();
        var itemDescBox = new Container();
        var itemRefBox = new Container();
        var itemDesc = null;
        var itemRef = null;
        var elapsed = 0;
        var secTime = 1000;
        var initTime = 180;
        var tweenDesc = null;

        THIS.OUT_Y = 200;
        THIS.timeBar = null;

        var timeBonusElapsed = null;
        var itemsScore = null;
        var itemStack = [];
        var iconStack = null;
        var avatarName = null;
        var hudIconStack;
        var stack;
        var iconText = null;
        var xPos = 180;
        var yPos = 370;
        var h = 0;
        var isClicked = false;
        var strokes = null;
        var completeCount = 0;

        var toggleHolder = new Container();
        var isToggled = false;

        // minimap variables
        var newClientHeight = null;
        var mmHeight = null;
        var mmWidth = null;
        var minOWidth = null;
        var minOHeight = null;
        var minLeftPos = null;
        var minTopPos = null;
        var scrollX;
        var scrollY;

        //constructor:
        THIS.initialize = function (worldId)
        {
            // trace("PlayScene.initialize..");
            THIS.super_initialize();
            THIS.placeGraphics(worldId);
            THIS.changeState(THIS.LEVEL_START);
            util.toggleUI(true);
            ngMain.stage.update();
        }

        // public methods:
        THIS.placeGraphics = function (worldId)
        {
            // trace("PlayScene.placeGraphics()");

            THIS.bgBitmap = util.getAssetBitmap('gameBg');
            THIS.bgLayer.addChild(THIS.bgBitmap);
            
            // map
            levelBG = new Bitmap('theme/images/worlds/level1/level1.png');
            mapLayer.addChild(levelBG);
            
            THIS.addChild(THIS.bgLayer);
            THIS.addChild(mapLayer);
            THIS.hudLayer.addChild(frontLayer);

            THIS.itemRender();
            THIS.renderLevelMap();

        }

        THIS.itemRender = function()
        {

            var items = ngMain.itemsData;

            var psX = getRandomArbitary(0, 2048);
            var psY = getRandomArbitary(0, 300);
            var preschool = THIS.sprite.frame('preschool_can-piece');
            preschool.x = Math.round(psX);
            preschool.y = Math.round(psY);
            preschool.scaleX = preschool.scaleY = 0.8;
            mapLayer.addChild(preschool);
            preschool.onPress = function(evt) {
                var curY = this.y;
                var curX = this.x;
                var sideMove = 120;
                var dir = Math.random() > 0.5 ? -1 : -1;

                if (!util.sfxIsMute)
                {
                    util.getGameAudio('play', util.audioPicItemSFX);
                }

                THIS.score = THIS.score + 500;
                timeBonusElapsed = elapsed - (100000);
                THIS.statsBar.timeBar.updateTime(timeBonusElapsed, initTime, secTime);
                THIS.hudLayer.removeChild(iconAvatar);
                            
                iconAvatar.removeAllChildren();
                THIS.avatar = THIS.sprite.frame('preschool_can-avatar');
                THIS.avatar.x = 10;
                THIS.avatar.y = 310;
                THIS.avatar.scaleX = THIS.avatar.scaleY = 0.5;

                strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
                avatarName = new TextStroke("Pre-School", "24px Bowlby One SC", strokes, "center");
                avatarName.textAlign = "right";
                avatarName.x = 90;
                avatarName.y = 415;

                Tween.get(preschool).to({ x: curX + sideMove }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ x: curX - sideMove }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ x: curX + sideMove }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ x: curX }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ rotation: 45, y: curY + dir * 150, scaleX: 1.2, scaleY: 1.2 }, (util.QUEUE_TWEEN_TIME * 1000) * 0.6, Ease.sineOut).to({alpha: 0}, (util.QUEUE_TWEEN_TIME * 1000) * 0.4);

                iconAvatar.addChild(THIS.avatar);
                iconAvatar.addChild(avatarName);
                THIS.hudLayer.addChild(THIS.avatarHud);
                THIS.hudLayer.addChild(iconAvatar);
            }


            for ( item in items )
            {
                itemStack.push({'avatar' : items[item].avatar,'name' : item.slice(item.indexOf("_") + 1, item.length), 'item' : items[item].piece, 'stack' : items[item].stack, 'desc' : items[item].desc, 'ref' : items[item].ref});
                stack = items[item].stack;

                itemDescBg = util.getAssetBitmap('gameItemDesc');
                itemDescBg.x = 0;
                itemDescBg.y = 460;
                itemDescBox.addChild(itemDescBg);
                itemCloseBtn = util.createButton('descCloseBtn', true);
                util.addChildAtPos(itemDescBox, itemCloseBtn, 530, 485);
                itemCloseBtn.onClick = function (e) { THIS.itemDescCloseBtn() };

                // item piece
                for (var i = 0; i < items[item].stack; i ++)
                {
                    THIS.piece[i] = THIS.sprite.frame(items[item].piece);
                    THIS.piece[i].x = items[item].points[i].x;
                    THIS.piece[i].y = items[item].points[i].y;
                    THIS.piece[i].name = item.slice(item.indexOf("_") + 1, item.length);
                    THIS.piece[i].piece = items[item].piece;
                    THIS.piece[i].avatar = items[item].avatar;
                    THIS.piece[i].score = items[item].score;
                    THIS.piece[i].stack = items[item].stack;
                    THIS.piece[i].desc = items[item].desc;
                    THIS.piece[i].ref = items[item].ref;
                    THIS.piece[i].timeBonus = items[item].timeBonus;

                    mapLayer.addChild(THIS.piece[i]);

                    (function(target) {
                        THIS.piece[i].onPress = function(evt) {
                            var curY = target.y;
                            var curX = target.x;
                            var sideMove = 120;
                            var dir = Math.random() > 0.5 ? -1 : -1;
                            
                            if (!util.sfxIsMute)
                            {
                                util.getGameAudio('play', util.audioPicItemSFX);
                            }

                            THIS.score = THIS.score + target.score;
                            timeBonusElapsed = elapsed - (target.timeBonus * 1000);

                            THIS.statsBar.timeBar.updateTime(timeBonusElapsed, initTime, secTime);

                            isClicked = true;
                            iconBodyStack.removeAllChildren();

                            THIS.updateStack(target.piece, target.stack);

                            Tween.get(target).to({ x: curX + sideMove }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ x: curX - sideMove }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ x: curX + sideMove }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ x: curX }, util.WRONG_TIME / 4, Ease.cubicInOut).to({ rotation: 45, y: curY + dir * 150, scaleX: 1.2, scaleY: 1.2 }, (util.QUEUE_TWEEN_TIME * 1000) * 0.6, Ease.sineOut).to({alpha: 0}, (util.QUEUE_TWEEN_TIME * 1000) * 0.4);
                            
                            THIS.hudLayer.removeChild(iconAvatar);
                            
                            if ( target.name == "wheatbread" ) target.name = "wheat bread";
                            iconAvatar.removeAllChildren();
                            THIS.avatar = THIS.sprite.frame(target.avatar);
                            THIS.avatar.x = -30;
                            THIS.avatar.y = 320;
                            THIS.avatar.scaleX = THIS.avatar.scaleY = 0.8;

                            strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
                            avatarName = new TextStroke(target.name, "24px Bowlby One SC", strokes, "center");
                            avatarName.textAlign = "right";
                            avatarName.x = 90;
                            avatarName.y = 415;

                            itemDescBox.removeChild(itemDesc);
                            itemDescBox.removeChild(itemRef);
                            // THIS.hudLayer.removeChild(THIS.avatarHud);
                            itemDesc = new Text("", "10px Bowlby One SC", "#ffffff");
                            itemDesc.text = target.desc;
                            itemDesc.lineWidth = 358;
                            itemDesc.x = 150;
                            itemDesc.y = 485;

                            itemRef = new Text("", "10px Arial", "#ffffff");
                            itemRef.text = target.ref;
                            itemRef.lineWidth = 358;
                            itemRef.x = 150;
                            itemRef.y = 530;

                            itemDescBox.addChild(itemDesc);
                            itemDescBox.addChild(itemRef);

                            tweenDesc = Tween.get(itemDescBox, {override:true}).to({ y: -100 }, 300 , Ease.sineIn).wait(2400).to({ y: 100 }, 500 , Ease.sineOut);

                            iconAvatar.addChild(THIS.avatar);
                            iconAvatar.addChild(avatarName);
                            THIS.hudLayer.addChild(itemDescBox);
                            THIS.hudLayer.addChild(THIS.avatarHud);
                            THIS.hudLayer.addChild(iconAvatar);
                        }
                    })(THIS.piece[i]);

                }

                iconName = item.slice(item.indexOf("_") + 1, item.length);

                // item icon
                THIS.piece[h] = THIS.sprite.frame(items[item].piece);
                THIS.piece[h].x = Number(xPos);
                THIS.piece[h].y = Number(yPos);
                THIS.piece[h].name = item.slice(item.indexOf("_") + 1, item.length);
                THIS.piece[h].avatar = items[item].avatar;
                THIS.piece[h].score = items[item].score;
                THIS.piece[h].desc = items[item].desc;
                THIS.piece[h].ref = items[item].ref;
                
                // place item name
                if (iconName == "wheatbread") iconName = "wheat bread";
                strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 2 }];
                iconText = new TextStroke(iconName, "8px Bowlby One SC", strokes, "center");
                iconText.x = Number(xPos) + 20;
                iconText.y = Number(yPos) + 40;

                // place item stack
                strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
                hudIconStack = new TextStroke(stack, "16px Bowlby One SC", strokes, "center");
                hudIconStack.x = Number(xPos) + 35;
                hudIconStack.y = Number(yPos) - 5;

                (function(target) {
                    THIS.piece[h].onPress = function(evt) {
                        THIS.hudLayer.removeChild(iconAvatar);
                        iconAvatar.removeAllChildren();

                        THIS.avatar = THIS.sprite.frame(target.avatar);
                        THIS.avatar.x = -30;
                        THIS.avatar.y = 320;
                        THIS.avatar.scaleX = THIS.avatar.scaleY = 0.8;

                        if ( target.name == "wheatbread" ) target.name = "wheat bread";
                        strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
                        avatarName = new TextStroke(target.name, "24px Bowlby One SC", strokes, "center");
                        avatarName.textAlign = "right";
                        avatarName.x = 90;
                        avatarName.y = 415;

                        itemDescBox.removeChild(itemDesc);
                        itemDescBox.removeChild(itemRef);
                        // THIS.hudLayer.removeChild(THIS.avatarHud);
                        itemDesc = new Text("", "10px Bowlby One SC", "#ffffff");
                        itemDesc.text = target.desc;
                        itemDesc.lineWidth = 358;
                        itemDesc.x = 150;
                        itemDesc.y = 485;

                        itemRef = new Text("", "10px Arial", "#ffffff");
                        itemRef.text = target.ref;
                        itemRef.lineWidth = 358;
                        itemRef.x = 150;
                        itemRef.y = 530;

                        itemDescBox.addChild(itemDesc);
                        itemDescBox.addChild(itemRef);

                        tweenDesc = Tween.get(itemDescBox, {overrid:true}).to({ y: -100 }, 300 , Ease.sineIn).wait(2400).to({ y: 100 }, 500 , Ease.sineOut);

                        iconAvatar.addChild(THIS.avatar);
                        iconAvatar.addChild(avatarName);
                        THIS.hudLayer.addChild(iconAvatar);
                    }
                    
                    THIS.piece[h].onMouseOver = function() {
                        $('#viewporter').removeClass().addClass('ctrPointer');
                        target.scaleX = target.scaleY = 1.07;
                    }
                    
                    THIS.piece[h].onMouseOut = function() {
                        $('#viewporter').removeClass().addClass('ctrCursor');
                        target.scaleX = target.scaleY = 1;
                    }

                })(THIS.piece[h]);

                iconBodyStack.addChild(hudIconStack);
                iconBody.addChild(THIS.piece[h]);
                iconBody.addChild(iconText);
                iconBody.addChild(iconBodyStack);
                
                xPos = xPos + 60;

            }

            THIS.avatar = THIS.sprite.frame(itemStack[0].avatar);
            THIS.avatar.x = -30;
            THIS.avatar.y = 320;
            THIS.avatar.scaleX = THIS.avatar.scaleY = 0.8;

            if (itemStack[0].name == "wheatbread") itemStack[0].name = "wheat bread";
            strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
            avatarName = new TextStroke(itemStack[0].name, "24px Bowlby One SC", strokes, "center");
            avatarName.textAlign = "right";
            avatarName.x = 90;
            avatarName.y = 415;

            iconAvatar.addChild(THIS.avatar);
            iconAvatar.addChild(avatarName);
            THIS.hudLayer.addChild(iconAvatar);
            
        }

        THIS.updateStack = function(item, stack)
        {
            var xPos = 180;
            
            for ( iconStack in itemStack )
            {
                if (itemStack[iconStack].item == item && isClicked)
                {
                    var stackBonus = itemStack[iconStack].stack;

                    newStack = itemStack[iconStack].stack - 1;
                    itemStack[iconStack].stack = newStack;

                    if ( newStack == 0)
                    {
                        completeCount = completeCount + 1;

                        THIS.score = THIS.score + stackBonus * 2;

                        trace(completeCount);

                        ngMain.popupViewer.addPopup(new ItemCompletePopup(itemStack[iconStack].name, itemStack[iconStack].avatar, itemStack[iconStack].desc));
                        $(document).trigger(util.VIEW_POPUPS, [THIS.pausePopupClosedCallback, false]);

                        if (completeCount == 6)
                        {
                            Tween.get(THIS).wait(secTime).call(THIS.closePrevPopup, [false]);
                        }
                    }
                }

                stack = itemStack[iconStack].stack;

                // place item stack
                strokes = [{ color: "#4270a6" }, { color: "#ffffff", lineWidth: 5 }];
                hudIconStack = new TextStroke(stack, "16px Bowlby One SC", strokes, "center");
                hudIconStack.x = Number(xPos) + 35;
                hudIconStack.y = Number(yPos) - 5;

                iconBodyStack.addChild(hudIconStack);
                iconBody.addChild(iconBodyStack);
                THIS.hudLayer.addChild(iconBody);

                xPos = xPos + 60;

            }
        }

        THIS.itemDescCloseBtn = function ()
        {
            Tween.get(itemDescBox,{override: true}).to({ y: 100 }, 300 , Ease.sineOut);
        }

        THIS.changeState = function (newState)
        {
            var stateHasChanged;
            if (THIS.curState != newState)
            {
                THIS.prevState = THIS.curState;
                THIS.curState = newState;
                // trace("PlayScene state changed to: " + newState);
                stateHasChanged = true;
                THIS.handleStateChange();
            }
            else
            {
                // trace("PlayScene state repeated : " + newState);
                stateHasChanged = false;
            }
            return stateHasChanged;
        }

        THIS.handleStateChange = function ()
        {
            switch (THIS.curState)
            {
                case THIS.LEVEL_START:
                    THIS.prepareLevelData();
                    break;
                case THIS.LIVE:
                    THIS.enabledEvent(true);
                    break;
            }
        }

        THIS.prepareLevelData = function ()
        {
            // trace("prepareLevelData " + THIS.currentLevel);
            THIS.startTime = Date.now() / secTime;
            THIS.pauseTime = 0;
            THIS.timeLeft = initTime - ((Date.now() - THIS.pauseTime - THIS.startTime) / secTime);
            elapsed = Date.now() - THIS.pauseTime - THIS.timeLeft;

            THIS.statsBar.resetAndShow(elapsed, initTime, secTime, THIS.score, 1);
            THIS.startNextLevel();
        }

        //reset all game logic
        THIS.restart = function ()
        {
            // trace("*** restart level: " + THIS.currentLevel);
            ngMain.stage.clear();
            THIS.startTime = Date.now();
            THIS.pauseTime = 0;
            THIS.pauseStart = null;
            elapsed = 0;
            //start game timer
            THIS.changeState(THIS.LIVE);
        }

        THIS.renderLevelMap = function()
        {
            // trace('render game view...');
            // game canvas renderer
            var render = function(left, top, zoom)
            {
                // Sync current dimensions with canvas
                THIS.width = clientWidth;
                THIS.height = clientHeight;

                minOWidth = ngMain.minOverlay.offsetHeight;
                minOHeight = ngMain.minOverlay.offsetWidth;

                newClientHeight = clientHeight - 30;

                mmWidth = clientWidth / (zoom * 10);
                mmHeight = newClientHeight / (zoom * 10);

                minLeftPos = ngMain.minLoc.offsetLeft;
                minTopPos = ngMain.minLoc.offsetTop;

                ngMain.minLoc.style.left = -(left / (zoom * 10)) + 'px';
                ngMain.minLoc.style.top = -(top / (zoom * 10)) + 'px';
                ngMain.minLoc.style.width = mmWidth + 'px';
                ngMain.minLoc.style.height = mmHeight + 'px';
                ngMain.minLoc.style.backgroundSize = '200px 200px';

                // Use rendering
                rendering.setup(clientWidth, clientHeight - 100, contentWidth, contentHeight);
                rendering.render(left, top, zoom, paint);

            };

            var paint = function(left, top, width, height, zoom)
            {
                mapLayer.x = left;
                mapLayer.y = top;
                mapLayer.scaleX = mapLayer.scaleY = zoom;

                ngMain.minLoc.style.left = -(left / (zoom * 10)) + 'px';
                ngMain.minLoc.style.top = -(top / (zoom * 10)) + 'px';
                ngMain.minLoc.style.backgroundPosition = -minLeftPos + 'px' + ' ' +  -minTopPos + 'px';
                ngMain.minLoc.style.width = clientWidth / (zoom * 10) + 'px';
                ngMain.minLoc.style.height = newClientHeight / (zoom * 10) + 'px';
                

                // console.log('minLocLeft: ', ngMain.minLoc.offsetLeft, 'mapLeft:', left);

                Drag.init(ngMain.minLoc, null, 0, 200, 0, 200);
                ngMain.minLoc.onDragStart = function(x, y)
                {
                    scroller.scrollTo(x*10*zoom, y*10*zoom, true, zoom);
                }

                ngMain.minLoc.onDrag = function(x, y)
                {
                    scroller.scrollTo(x*10*zoom, y*10*zoom, true, zoom);
                }

                ngMain.minLoc.onDragEnd = function(x, y)
                {
                    scroller.scrollTo(x*10*zoom, y*10*zoom, true, zoom);
                }

                THIS.addChild(mapLayer);
                THIS.addChild(THIS.hudLayer);
            }

            // Initialize Scroller
            scroller = new Scroller(render, {
                zooming: true,
                bouncing: false,
                minZoom: 0.39,
                maxZoom: 1.2
            });

            var rect = ngMain.canvas.getBoundingClientRect();
            scroller.setPosition(rect.left + ngMain.canvas.clientLeft, rect.top + gameView.clientTop);

            // Reflow handling
            var reflow = function() {
                clientWidth = ngMain.canvas.clientWidth;
                clientHeight = ngMain.canvas.clientHeight - 80;
                scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
            };

            window.addEventListener('resize', reflow, false);
            reflow();

            document.querySelector("#magnify #zoomIn").addEventListener("click", function() {
                scroller.zoomBy(1.2, true);
            }, false);

            document.querySelector("#magnify #zoomOut").addEventListener("click", function() {
                scroller.zoomBy(0.8, true);
            }, false);

            THIS.createHUD();

        }
        
        THIS.createHUD = function ()
        {
            THIS.hud = util.getAssetBitmap('gameHUD');
            THIS.hud.x = 0;
            THIS.hud.y = 348;
            

            THIS.avatarHud = util.getAssetBitmap('gameAvatarBg');
            THIS.avatarHud.x = -60;
            THIS.avatarHud.y = 310;

            THIS.hudLayer.addChild(THIS.hud);
            
            // pause game
            THIS.menuButton = util.createButton('menuButton_n');
            util.addChildAtPos(THIS.hudLayer, THIS.menuButton, 710, 350);
            THIS.menuButton.onClick = function (e) { THIS.pauseButtonClicked(true) };

            // sfx button
            THIS.igSFXButton = util.createButton('ingameSFXButton');
            util.addChildAtPos(THIS.hudLayer, THIS.igSFXButton, 600, 380);
            THIS.igSFXButton.onClick = function (e) { THIS.igSFXButtonClicked() };

            // bgm button
            THIS.igBGMButton = util.createButton('ingameBGMButton');
            util.addChildAtPos(THIS.hudLayer, THIS.igBGMButton, 615, 420);
            THIS.igBGMButton.onClick = function (e) { THIS.igBGMButtonClicked() };

            // toggle map button
            THIS.igToggleMapButton = util.createButton('ingameHideMapButton');
            util.addChildAtPos(toggleHolder, THIS.igToggleMapButton, 740, 410);
            THIS.igToggleMapButton.onClick = function (e) { THIS.igToggleMapButtonClicked() };
            THIS.hudLayer.addChild(toggleHolder);

            // ADD TIME BAR
            THIS.statsBar = new StatsBar();
            util.addChildAtPos(THIS.hudLayer, THIS.statsBar, 0, 0);

            // ADD ITEM ICON
            THIS.hudLayer.addChild(iconBody);
            THIS.hudLayer.addChild(itemDescBox);
            THIS.hudLayer.addChild(THIS.avatarHud);
            THIS.hudLayer.addChild(iconAvatar);
        
        }

        THIS.igToggleMapButtonClicked = function ()
        {
            if (isToggled)
            {
                THIS.igToggleMapButton = null;
                toggleHolder.removeAllChildren();
                THIS.igToggleMapButton = util.createButton('ingameHideMapButton');
                util.addChildAtPos(toggleHolder, THIS.igToggleMapButton, 740, 410);
                THIS.igToggleMapButton.onClick = function (e) { THIS.igToggleMapButtonClicked() };
                isToggled = false;
                toggle('minimap-holder');
            }
            else
            {
                THIS.igToggleMapButton = null;
                toggleHolder.removeAllChildren();
                THIS.igToggleMapButton = util.createButton('ingameShowMapButton');
                util.addChildAtPos(toggleHolder, THIS.igToggleMapButton, 740, 410);
                THIS.igToggleMapButton.onClick = function (e) { THIS.igToggleMapButtonClicked() };
                isToggled = true;
                toggle('minimap-holder');
            }
            
        }

        THIS.pauseButtonClicked = function (state)
        {
            THIS.changeState(THIS.PAUSE);
            $('#viewporter').removeClass().addClass('ctrCursor');
            if (state){
                THIS.pauseStart = Date.now();
            }
            
            ngMain.popupViewer.addPopup(new PausePopup());
            $(document).trigger(util.VIEW_POPUPS, [THIS.pausePopupClosedCallbackEmpty, false]);
        }

        THIS.pausePopupClosedCallback = function (resume)
        {
            if (!resume)
            {
                THIS.pauseStart = Date.now();
            }
            else
            {
                THIS.changeState(THIS.LIVE);
                THIS.pauseTime += Date.now() - THIS.pauseStart;
                THIS.pauseStart = null;
            }
        }

        THIS.pausePopupClosedCallbackEmpty = function (resume) { console.log('boom'); }

        THIS.confirmPopupView = function(popupState)
        {
            THIS.changeState(THIS.PAUSE);
            ngMain.popupViewer.addPopup(new ConfirmPopup(popupState));
            $(document).trigger(util.VIEW_POPUPS, [THIS.confirmPopupClosed]);
        }

        THIS.confirmPopupClosed = function (popupState)
        {
            switch (popupState)
            {
                case 'POP_MENU_GAME':
                    ngMain.gotoMenuHandler();
                    break;
                case 'POP_RESTART_GAME':
                    ngMain.gotoGamePopupCallback();
                    break;
                case 'POP_TUTORIAL':
                    ngMain.gotoTutorialHandler();
                    break;
            }

            THIS.changeState(THIS.LIVE);
        }

        THIS.pausePopupResumeCallback = function ()
        {
            trace("pause resume");
        }

        THIS.igSFXButtonClicked = function ()
        {
            if (!util.sfxIsMute)
            {
                util.getGameAudio('mute', util.audioSFX);
                util.sfxIsMute = true;
            }
            else
            {
                util.getGameAudio('unmute', util.audioSFX);
                util.sfxIsMute = false;
            }
            
        }

        THIS.igBGMButtonClicked = function ()
        {
            if (!util.bgmIsMute)
            {
                util.getGameAudio('mute', util.audioBGM);
                util.bgmIsMute = true;
            }
            else
            {
                util.getGameAudio('unmute', util.audioBGM);
                util.bgmIsMute = false;
            }
            
        }

        THIS.update = function ()
        {
            if (THIS.curState == THIS.LIVE)
            {
                elapsed = Date.now() - THIS.pauseTime - THIS.startTime;
                THIS.statsBar.timeBar.updateTime(elapsed, initTime, secTime);
                if (elapsed / secTime >= initTime)
                {
                    THIS.timesUp();
                }
            }
        }

        THIS.onBarOut = function (elapsed, initTime)
        {
            if (THIS.timeBar)
            {
                THIS.removeChild(THIS.timeBar);
                THIS.timeBar = null;
            }
        }

        THIS.startNextLevel = function ()
        {
            THIS.onHold = false;
            // trace("startNextLevel");
            THIS.restart();
        }

        THIS.timesUp = function ()
        {
            // trace("timesUp!!!");
            THIS.changeState(THIS.GAME_OVER);
            THIS.currentLevel = 0;
            Tween.get(THIS).wait(secTime).call(THIS.showGameFinishedPopup, [false]);
        }

        THIS.showGameFinishedPopup = function (isComplete)
        {
            ngMain.popupViewer.addPopup(new GameOverPopup(THIS.score, util.calcXpToAdd(THIS.score), (THIS.score > THIS.myAllTime), isComplete));
            $(document).trigger(util.VIEW_POPUPS, [THIS.gameOverPopupClosed]);
        }

        THIS.gameOverPopupClosed = function ()
        {
            $(document).trigger(util.GOTO_MENU);
        }

        THIS.closePrevPopup = function ()
        {
            ngMain.popupViewer.closePopup(new ItemCompletePopup(itemStack[iconStack].name, itemStack[iconStack].avatar, itemStack[iconStack].desc));
            Tween.get(THIS).wait(secTime).call(THIS.showLevelFinishedPopup, [false]);
        }

        THIS.showLevelFinishedPopup = function (isComplete)
        {
            ngMain.popupViewer.addPopup(new LevelCompletePopup(THIS.score, util.calcXpToAdd(THIS.score), (THIS.score > THIS.myAllTime), isComplete));
            $(document).trigger(util.VIEW_POPUPS, [THIS.levelCompletePopupClosed]);
        }

        THIS.levelCompletePopupClosed = function ()
        {
            $(document).trigger(util.GOTO_MENU);
        }

        THIS.useClock = function ()
        {
            THIS.startTime += THIS.CLOCK_BONUS * 1000;
            if (Date.now() < THIS.startTime)
                THIS.startTime = Date.now();
        }

        THIS.createScoreClip = function (s)
        {
            var scoreClip = new ScoreClip(s, THIS.speedMatchCount - 5);
            util.addChildAtPos(frontLayer, scoreClip, 500, 500);
            scoreClip.startTween();
        }


        THIS.killScoreClip = function (scoreClip)
        {
            THIS.frontLayer.removeChild(scoreClip);
            scoreClip = null;
        }

        THIS.enabledEvent = function (isEnabled)
        {
            if ('ontouchstart' in window) 
            {

                ngMain.canvas.addEventListener('touchstart', function(e) {
                    // Don't react if initial down happens on a form element
                    if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                        return;
                    }

                    scroller.doTouchStart(e.touches, e.timeStamp);
                    e.preventDefault();
                }, false);

                ngMain.canvas.addEventListener('touchmove', function(e) {
                    scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                }, false);

                ngMain.canvas.addEventListener('touchend', function(e) {
                    scroller.doTouchEnd(e.timeStamp);
                }, false);

                ngMain.canvas.addEventListener('touchcancel', function(e) {
                    scroller.doTouchEnd(e.timeStamp);
                }, false);

            } 

            else 

            {

                var mousedown = false;

                ngMain.canvas.addEventListener('mousedown', function(e) {
                    if (e.target.tagName.match(/input|textarea|select/i)) {
                        return;
                    }
                    
                    scroller.doTouchStart([{
                        pageX: e.pageX,
                        pageY: e.pageY
                    }], e.timeStamp);

                    mousedown = true;
                }, false);

                ngMain.canvas.addEventListener('mousemove', function(e) {
                    if (!mousedown) {
                        return;
                    }
                    
                    scroller.doTouchMove([{
                        pageX: e.pageX,
                        pageY: e.pageY
                    }], e.timeStamp);

                    mousedown = true;
                }, false);

                ngMain.canvas.addEventListener('mouseup', function(e) {
                    if (!mousedown) {
                        return;
                    }
                    
                    scroller.doTouchEnd(e.timeStamp);

                    mousedown = false;
                }, false);

                ngMain.canvas.addEventListener(navigator.userAgent.indexOf('Firefox') > -1 ? 'DOMMouseScroll' :  'mousewheel', function(e) {
                    scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
                }, false);

            }

        }

        THIS.initialize(worldId);
    }

    // REVEAL CLASS TO WINDOW
    window.PlayScene = PlayScene;

} (window));