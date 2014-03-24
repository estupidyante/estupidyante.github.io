/*===============================================================
Game.js -- enable/disable touch/mouse || changeScene || preload

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
===============================================================*/
//************* GLOBALS: ********************
var ngMain = {};
var util = {};
//*******************************************
function initMainGame()
{
	util = new GameEngine();
	ngMain = new NGMain();
	ngMain.init();
}

function NGMain()
{
	var THIS = this;
	THIS.assetsType = ""; // asset type or extension
	THIS.canvas = {}; // canvas
	THIS.stage = {}; // stage
	THIS.gameView = {}; // gameview screen for the content layer
	THIS.initWidth = 0; // width of the stage
	THIS.initHeight = 0; // height of the stage
	THIS.loading = null; // loading screen
	THIS.menu = null; // welcome screen
	THIS.lobby = null; // level screen
	THIS.gameWorld = null; // game screen
	THIS.popupViewer = null; // popups
	THIS.prevState = ""; // previous state
	THIS.curState = ""; // current state
	THIS.achievements = []; // achievement data
    THIS.isInitLoad = true; // scale to fit - true if it is from load
	THIS.contentLayer = null; // content layer or state layer
	THIS.initLoadingDone = false; // preloader if loading is done
    THIS.imagesQueue = imagesQ; // image preloader
    THIS.itemsData = null;
    THIS.popupState = null;

    // minimap UI
    THIS.magnify = document.getElementById('magnify');
    THIS.miniMapHolder = document.getElementById('minimap-holder');
    THIS.miniMap = document.getElementById('minimap');
    THIS.minMap = document.getElementById('layer-map');
    THIS.minLoc = document.getElementById('layer-box');
    THIS.minOverlay = document.getElementById('layer-overlay');

	// resize the game area according to the width and height of a browser
	THIS.resizeGame = function ()
    {
        var widthToHeight = 4 / 3;
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthToHeight = newWidth / newHeight;

        THIS.gameView.style.width = 780 + 'px';
        THIS.gameView.style.height = 460 + 'px';

        THIS.gameView.style.marginTop = (-460 / 2) + 'px';
        THIS.gameView.style.marginLeft = (-780 / 2) + 'px';

        var scaleTo;
        if (!THIS.isInitLoad)
        {
            scaleTo = 780 / THIS.canvas.width;
            // trace("newWidth: " + newWidth + " newHeight: " + newHeight + " scaleStage: " + scaleTo);
            THIS.stage.scaleX = THIS.stage.scaleX * scaleTo;
            THIS.stage.scaleY = THIS.stage.scaleY * scaleTo;
        }
        else
        {
            scaleTo = 780 / 780;
            // trace("newWidth: " + newWidth + " newHeight: " + newHeight + " scaleStage: " + scaleTo);
            THIS.stage.scaleX = THIS.stage.scaleX * scaleTo;
            THIS.stage.scaleY = THIS.stage.scaleY * scaleTo;
            THIS.isInitLoad = false;
        }

        THIS.canvas.width = 780;
        THIS.canvas.height = 460;

        // var widthToHeight = 4 / 3;
        // var newWidth = window.innerWidth;
        // var newHeight = window.innerHeight;
        // var newWidthToHeight = newWidth / newHeight;

        // if (newWidthToHeight > widthToHeight)
        // {
        //     newWidth = newHeight * widthToHeight;
        // } else
        // {
        //     newHeight = newWidth / widthToHeight;
        // }

        // if (newWidth > 780 || newHeight > 460)
        // {
        //     newWidth = 780;
        //     newHeight = 460;
        // }


        // THIS.gameView.style.width = newWidth + 'px';
        // THIS.gameView.style.height = newHeight + 'px';

        // THIS.gameView.style.marginTop = (-newHeight / 2) + 'px';
        // THIS.gameView.style.marginLeft = (-newWidth / 2) + 'px';


        // var scaleTo;
        // if (!THIS.isInitLoad)
        // {
        //     scaleTo = newWidth / THIS.canvas.width;
        //     // trace("newWidth: " + newWidth + " newHeight: " + newHeight + " scaleStage: " + scaleTo);
        //     THIS.stage.scaleX = THIS.stage.scaleX * scaleTo;
        //     THIS.stage.scaleY = THIS.stage.scaleY * scaleTo;
        // }
        // else
        // {
        //     scaleTo = newWidth / 780;
        //     // trace("newWidth: " + newWidth + " newHeight: " + newHeight + " scaleStage: " + scaleTo);
        //     THIS.stage.scaleX = THIS.stage.scaleX * scaleTo;
        //     THIS.stage.scaleY = THIS.stage.scaleY * scaleTo;
        //     THIS.isInitLoad = false;
        // }
        // THIS.canvas.width = newWidth;
        // THIS.canvas.height = newHeight;

        // if (THIS.initWidth == 0)
        // {
        //     THIS.initWidth = THIS.canvas.width;
        //     THIS.initHeight = THIS.canvas.height;
        // }
    }

	// enable touch/mouse
	THIS.init = function()
	{
		// trace('init...');
		// window.addEventListener('resize', THIS.resizeGame, false);
  //       window.addEventListener('orientationchange', THIS.resizeGame, false);
        
        document.body.addEventListener('touchmove', function (event)
        {
            event.preventDefault();
        }, false);

        document.body.addEventListener('touchstart', function (event)
        {
            event.preventDefault();
        }, false);

        THIS.canvas = document.getElementById('gameCanvas');
        THIS.gameView = document.getElementById('gameView');

        THIS.initEventBindings();
        THIS.stage = new Stage(THIS.canvas);
        THIS.stage.snapToPixel = true;
        
        THIS.resizeGame();
        
        if (Touch.isSupported())
        {
            Touch.enable(THIS.stage);
            THIS.canvas.addEventListener('touchstart', THIS.touchStartHandler, false);
        }
        else
        {
            THIS.stage.enableMouseOver(20);
        }

        THIS.contentLayer = new Container();
        THIS.stage.addChild(THIS.contentLayer);
        Ticker.addListener(THIS);
        THIS.popupViewer = new PopupViewer();
        util.loadXML("screens.xml", THIS.screensXMLLoaded);
        THIS.getSpriteImage("atlas.png");
    
    }

    // load images from xml
    THIS.screensXMLLoaded = function (xmlData)
    {
        // trace('screenXML loaded...');
        util.screensXml = xmlData;
        THIS.imagesQueue.onComplete = THIS.initAssetsLoadComplete;
        THIS.imagesQueue.queue_images(util.getInitAssetsUrls());
        THIS.imagesQueue.process_queue();
        $(document).trigger(util.LOADING_START);
    }

    // load sprite image
    THIS.getSpriteImage = function (spriteImage)
    {
        
        THIS.spriteImageURL =  "theme/images/worlds/level1/" + spriteImage;
        var imageFrame = new SpriteLoader();
        imageFrame.loadSpriteImage(THIS.spriteImageURL);
        // trace('atlas image loaded..');
        THIS.imagesQueue.onComplete = THIS.initAssetsLoadComplete;
        THIS.imagesQueue.queue_images(util.getInitAssetsUrls());
        THIS.imagesQueue.process_queue();

        THIS.loadSprites();
        THIS.loadItems();
        THIS.loadSpawnPoints();

    }

    // screen xml loaded - execute asset load complete
    THIS.initAssetsLoadComplete = function ()
    {
        // TODO: temp - currently load sounds a synch
        // SoundJS.onLoadQueueComplete = THIS.soundsLoadComplete;
        var audioArray = util.getSoundsArray();

        for (key in audioArray)
        {
            if (audioArray[key].type == 'bgm')
            {
                util.audioBGM = new AudioManager.sound(audioArray[key].src);
            }
            else if (audioArray[key].type == 'sfx')
            {
                if (audioArray[key].id == "bubble")
                {
                    util.audioSFX = new AudioManager.sound(audioArray[key].src);
                }
                else
                {
                    util.audioPicItemSFX = new AudioManager.sound(audioArray[key].src);
                }
            }
        }
        // trace("init assets load complete.");
        
        THIS.soundsLoadComplete();
        THIS.loadImagesQueue();
    }

    // load sprite image
    THIS.loadSprites = function ()
    {
        // trace('atlas json');

        util.loadJSON("atlas.json", THIS.spriteDataLoaded);
    }

    THIS.loadItems = function ()
    {
        // trace('items json');

        util.loadJSON("items.json", THIS.itemDataLoaded);
    }

    THIS.loadSpawnPoints = function ()
    {
        // trace('spawnpoints json');

        util.loadJSON("spawnpoints.json", THIS.combiDataLoaded);
    }

    // callback
    // load sprites from atlas
    THIS.spriteDataLoaded = function (jsonData)
    {
        // trace('-- sprite data loaded');
        var jsonFrame = new SpriteLoader();
        jsonFrame.onLoadSpriteData(jsonData);

    }

    // load items
    THIS.itemDataLoaded = function ()
    {
        // trace('-- item json loaded');
        // trace('item data loaded...');
    }

    THIS.combiDataLoaded = function ()
    {
        // trace('-- combi json loaded');
        // trace('combi data loaded...');

        THIS.itemsData = ItemCombination.get(util.DATA_URL + util.itemsJSON, util.DATA_URL + util.spawnJSON);
    }

    // sound load complete
    THIS.soundsLoadComplete = function ()
    {
        // trace("soundsLoad complete");
    }

    // initEventBindings triggers the change scene
	THIS.initEventBindings = function ()
    {
    	$(document).bind(util.LOADING_START, function (e, data)
        {
            THIS.showLoading(); // show loading
        });
        
        $(document).bind(util.LOADING_COMPLETE, function (e, data)
        {
            THIS.hideLoading(); // hide loading
        });
        
        $(document).bind(util.GOTO_MENU, function (e, data)
        {
            THIS.gotoMenuHandler(); // lobby or main menu screen
        });
        
        $(document).bind(util.GOTO_LOBBY, function (e, data)
        {
            THIS.gotoLobbyHandler(); // lobby or main menu screen
        });

        $(document).bind(util.GOTO_TUTORIAL, function (e, data)
        {
            THIS.gotoTutorialHandler(); // lobby or main menu screen
        });
        
        $(document).bind(util.GOTO_GAME, function (e, data)
        {
            THIS.gotoGameHandler(); // render game
        });

        $(document).bind(util.GOTO_CREDITS, function (e, data)
        {
            THIS.gotoCreditsHandler(); // render game
        });

        $(document).bind(util.VIEW_POPUPS, function (e, data)
        {
            THIS.viewPopups(data); // popups
        });
    }

    THIS.loadImagesQueue = function ()
    {
        // On every image loaded show progress:
        THIS.imagesQueue.onLoaded = THIS.imageLoadedHandler;
        THIS.imagesQueue.onComplete = THIS.imagesQueueLoadComplete;
        //TODO: if we decide need to calc num unlocked for each world and preload the image.
        // THIS.imagesQueue.queue_images(util.getScreenUrls().concat(util.getWorldsLobbyUrls()));
        THIS.imagesQueue.process_queue();

        THIS.imagesQueueLoadComplete();
    }

    THIS.imageLoadedHandler = function ()
    {
        // trace("image loaded..")
    }

    THIS.imagesQueueLoadComplete = function ()
    {
        // trace("imagesQueueLoadComplete ");
        $(document).trigger(util.LOADING_COMPLETE);
        
        $(document).trigger(util.GOTO_MENU);
        THIS.initLoadingDone = true;
    }

	// touch start handler
	THIS.touchStartHandler = function (e)
    {
        if (THIS.curState == util.GAME)
            THIS.game.onTouchStart(e);
    }

	// enable mouse over - ex. video tutorial or else
	THIS.enableOverEvents = function (isEnabled)
    {
        if (!Touch.isSupported())
        {
            if (isEnabled)
                THIS.stage.enableMouseOver(50);
            else
                THIS.stage.enableMouseOver(0);
        }
    }

    // change state
    THIS.changeState = function (newState)
    {
        var stateHasChanged;
        if (THIS.curState != newState)
        {
            THIS.prevState = THIS.curState;
            THIS.curState = newState;
            // trace("state changed to: " + newState);
            stateHasChanged = true;
            THIS.handleStateChange();
        }
        else
        {
            // trace("state repeated : " + newState);
            stateHasChanged = false;
        }
        return stateHasChanged;
    }

    // handle the state change and trigger mouse over events for the states
    THIS.handleStateChange = function ()
    {
        switch (THIS.curState)
        {
            case util.MENU:
                THIS.enableOverEvents(true);
                break;
            case util.LOBBY:
                THIS.enableOverEvents(true);
                break;
            case util.TUTORIAL:
                THIS.enableOverEvents(true);
                break;
            case util.GAME:
                THIS.enableOverEvents(true);
                break;
            case util.POPUP:
                THIS.enableOverEvents(true);
                break;
        }
    }

    // adding tick
    THIS.tick = function ()
    {
        if (THIS.curState == util.GAME)
            THIS.game.update();
        if (!THIS.initLoadingDone && THIS.loading)
        {
            THIS.loading.tickHandler();
        }
        
        THIS.stage.update();
    }

    // PRELOADING
    // show loading screen
    THIS.showLoading = function ()
    {
        if (THIS.initLoadingDone)
        {
            if (!THIS.loading)
            {
                THIS.loading = new Loading();
                THIS.stage.addChild(THIS.loading);
            }
        }
        else
        {
            THIS.loading = new GameLoadingScene();
            THIS.stage.addChild(THIS.loading);
        }
    }

    // hide loading screen
    THIS.hideLoading = function ()
    {
        if (THIS.loading)
        {
            THIS.loading.fadeOut();
            Tween.get(THIS).wait(250).call(THIS.killLoading);
        }
    }

    // terminate loading screen when done
    THIS.killLoading = function ()
    {
        if (THIS.loading)
        {
            THIS.stage.removeChild(THIS.loading);
            THIS.loading = null;
        }

        if (!util.bgmIsMute)
        {
            util.getGameAudio('loop', util.audioBGM);
        }
    
    }

    // REMOVE SCREENS
    // remove menu screen
    THIS.removeMenuScreen = function ()
    {
        $(THIS.menu).unbind(util.MENU)
        THIS.contentLayer.removeChild(THIS.menu);
        THIS.menu = null;
    }

    // remove lobby / level screen
    THIS.removeLobbyScreen = function()
    {
        $(THIS.lobby).unbind(util.LOBBY)
        THIS.contentLayer.removeChild(THIS.lobby);
        THIS.lobby = null;
    }

    // remove credit screen
    THIS.removeCreditScreen = function()
    {
        $(THIS.credits).unbind(util.CREDITS)
        THIS.contentLayer.removeChild(THIS.credits);
        THIS.credits = null;
    }

    // remove tutorial screen
    THIS.removeTutorialScreen = function()
    {
        $(THIS.tutorial).unbind(util.TUTORIAL)
        THIS.contentLayer.removeChild(THIS.tutorial);
        THIS.tutorial = null;
    }

    // remove game screen
    THIS.removeGameScreen = function ()
    {
        $(document).unbind(util.GAME);
        THIS.contentLayer.removeChild(THIS.game);
        THIS.game = null;
    }

    // SCREEN HANDLERS
    // go to menu screen
    THIS.gotoMenuHandler = function ()
    {
        if (!THIS.changeState(util.MENU))
            return;

        THIS.showMenuScreen();
    }

    // go to lobby / level screen
    THIS.gotoLobbyHandler = function ()
    {
        if (!THIS.changeState(util.LOBBY))
            return;
        THIS.showLobby();
    }

    // go to tutorial screen
    THIS.gotoTutorialHandler = function ()
    {
        if (!THIS.changeState(util.TUTORIAL))
            return;

        THIS.showTutorial();
    }

    // go to credit screen
    THIS.gotoCreditsHandler = function ()
    {
        if (!THIS.changeState(util.CREDITS))
            return;

        THIS.showCredits();
    }

    // go to game screen
    THIS.gotoGameHandler = function ()
    {
        if (!THIS.changeState(util.GAME))
            return;

        THIS.showGameScene();
    }

    // SHOW SCREENS
    // show tutorial scene
    THIS.showCredits = function ()
    {
        if (THIS.menu)
        {
            THIS.removeMenuScreen();
        }
        if (THIS.tutorial)
        {
            THIS.removeTutorialScreen();
        }
        if (THIS.lobby)
        {
            THIS.removeLobbyScreen();
        }
        if (THIS.game)
        {
            THIS.contentLayer.removeChild(THIS.game);
            THIS.game = null;
        }

        $('#viewporter').removeClass().addClass('ctrCursor');
        THIS.credits = new CreditScene();
        THIS.contentLayer.addChild(THIS.credits);

    }

    // show tutorial scene
    THIS.showTutorial = function ()
    {
        if (THIS.menu)
        {
            THIS.removeMenuScreen();
        }
        if (THIS.credits)
        {
            THIS.removeCreditScreen();
        }
        if (THIS.lobby)
        {
            THIS.removeLobbyScreen();
        }
        if (THIS.game)
        {
            THIS.contentLayer.removeChild(THIS.game);
            THIS.game = null;
        }

        $('#viewporter').removeClass().addClass('ctrCursor');
        THIS.tutorial = new TutorialScene();
        THIS.contentLayer.addChild(THIS.tutorial);

    }

    // show menu scene or welcome screen
    THIS.showMenuScreen = function ()
    {
        if (THIS.tutorial)
        {
            THIS.removeTutorialScreen();
        }
        if (THIS.credits)
        {
            THIS.removeCreditScreen();
        }
        if (THIS.lobby)
        {
            THIS.removeLobbyScreen();
        }
        if (THIS.game)
        {
            THIS.contentLayer.removeChild(THIS.game);
            THIS.game = null;
        }

        THIS.itemsData = ItemCombination.get(util.DATA_URL + util.itemsJSON, util.DATA_URL + util.spawnJSON);
        $('#viewporter').removeClass().addClass('ctrCursor');
        THIS.menu = new MenuScene();
        THIS.contentLayer.addChild(THIS.menu);

    }

    // show lobby scene or level screen
    THIS.showLobby = function ()
    {
        if (THIS.menu)
        {
            THIS.removeMenuScreen();
        }
        if (THIS.credits)
        {
            THIS.removeCreditScreen();
        }
        if (THIS.tutorial)
        {
            THIS.removeTutorialScreen();
        }
        if (THIS.game)
        {
            THIS.contentLayer.removeChild(THIS.game);
            THIS.game = null;
        }
        $('#viewporter').removeClass().addClass('ctrCursor');
        THIS.lobby = new LevelScene();
        THIS.contentLayer.addChild(THIS.lobby);
    }

    // show game scene or game screen
    THIS.showGameScene = function ()
    {
        if (THIS.menu)
        {
            THIS.removeMenuScreen();
        }
        if (THIS.credits)
        {
            THIS.removeCreditScreen();
        }
        if (THIS.tutorial)
        {
            THIS.removeTutorialScreen();
        }
        if (THIS.lobby)
        {
            THIS.removeLobbyScreen();
        }
        if (THIS.game)
        {
            THIS.contentLayer.removeChild(THIS.game);
            THIS.game = null;
        }

        THIS.itemsData = ItemCombination.get(util.DATA_URL + util.itemsJSON, util.DATA_URL + util.spawnJSON);
        $('#viewporter').removeClass().addClass('ctrCursor');
        THIS.changeState(util.GAME);
        THIS.game = new PlayScene(util.currentWorld);
        THIS.contentLayer.addChild(THIS.game);
    }

    // restart game
    THIS.gotoGamePopupCallback = function (worldId)
    {
        THIS.showGameScene();
    }

    /***** POPUP *****/
    // confirm popup activated
    THIS.confirmClosedCallback = function (popupState)
    {
        THIS.game.pauseButtonClicked(false);
    }

    // menu / restart / tutorial game popup button
    THIS.statePopupCallback = function (popupState)
    {
        THIS.game.confirmPopupView(popupState);
    }

    // confirmed popup - button yes
    THIS.confirmYesPopupCallback = function (popupState)
    {
        THIS.game.confirmPopupClosed(popupState);
    }

    THIS.resumeGamePopupCallback = function (resume)
    {
        THIS.game.pausePopupClosedCallback(true);
    }

    // view popups
    THIS.viewPopups = function (viewPopupsCallback)
    {
        if (THIS.popupViewer.hasPopups())
        {
            // trace("viewing popups");
            THIS.changeState(util.POPUP);
            THIS.stage.addChild(THIS.popupViewer);
            THIS.popupViewer.startViewing(viewPopupsCallback);
        }
    }

    // close popups
    THIS.endPopupView = function (viewPopupsCallback,callbackParams)
    {
        THIS.changeState(THIS.prevState);
        THIS.stage.removeChild(THIS.popupViewer);
        if (viewPopupsCallback)
            viewPopupsCallback(callbackParams);
    }

    // sound button click - SFX Mouse Event
    THIS.soundBtnClicked = function ()
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

    // music button click - BGM Mouse Event
    THIS.musicBtnClicked = function ()
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

} // end of NGMain (NUTRISSENTAIL GAME Main)