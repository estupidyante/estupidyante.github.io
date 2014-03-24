/*===============================================================
GameEngine.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
===============================================================*/
function GameEngine()
{
	var THIS = this;

	// #region Events:

	// Main:
	THIS.GOTO_MENU = "EVT_GOTO_MENU"; // event go to menu or welcome screen
	THIS.GOTO_LOBBY = "EVT_GOTO_LOBBY"; // event go to lobby or choose level screen
	THIS.GOTO_TUTORIAL = "EVT_GOTO_TUTORIAL"; // event go to tutorial screen
	THIS.GOTO_GAME = "EVT_GOTO_GAME"; // event go to game screen
    THIS.GOTO_CREDITS = "EVT_GOTO_CREDITS"; // event go to credit screen
	THIS.GOTO_ACHIEVEMENTS = "EVT_GOTO_ACHIEVEMENTS"; // achievements according to score attained
	THIS.VIEW_POPUPS = "EVT_VIEW_POPUPS"; // event view popups
	THIS.VIEW_ITEM = "EVT_VIEW_ITEMS"; // event view item
	THIS.VIEW_ITEM_DESCRIPTION = "EVT_VIEW_ITEM_DESCRIPTION"; // event view item description
	THIS.LOADING_START = "EVT_LOADING_START"; // event start loading
	THIS.LOADING_COMPLETE = "EVT_LOADING_COMPLETE"; // event when loading complete
	THIS.UPDATE_XP_BAR = "EVT_UPDATE_XP_BAR"; // in-case we need to apply a leveling type of game
	// Game Round:
	THIS.GAME_START = "GAME_START"; // game screen
    THIS.POP_MENU = "POPUP_MENU";
    THIS.POP_RESTART = 'POPUP_RESTART';
    THIS.POPUP_TUTORIAL = "POPUP_TUTORIAL";
    THIS.POPUP_RETURN = "POPUP_RETURN";
    THIS.POPUP_NO = 'POPUP_NO';
    THIS.POPUP_YES = 'POPUP_YES';
	// Worlds:
    THIS.CRAZY_FIESTA = 1; // game level title
	// #endregion

	// #region States:
	THIS.LOADING = "SATTE_LOADING" // loading state
    THIS.MENU = "STATE_MENU"; // welcome state
	THIS.LOBBY = "STATE_LOBBY"; // the lobby or level state
	THIS.TUTORIAL = "STATE_TUTORIAL"; // tutorial state
	THIS.POPUP = "STATE_POPUP"; // popup state
	THIS.GAME = "STATE_GAME"; // game state
    THIS.CREDITS = "STATE_CREDITS"; // credit screen 
    THIS.CONFIRM = "STATE_CONFIRM";

	THIS.QUEUE_TWEEN_TIME = 0.65;
	THIS.WRONG_TIME = 0.75;

	THIS.ICON_WIDTH = 80;
	THIS.SCORE_TO_XP = 0.0065;
	THIS.ASSETS_SMALL = "small_";
	THIS.EXP_BAR_TWEEN_TIME = 120000; // 2 minutes
	THIS.currentWorld = 'CRAZY_FIESTA'; // current level / stage
	
	THIS.levelsExperience = [0, 25, 50, 100, 200, 400, 800, 1600]; // target experience
	THIS.lobbyWorldsOrder = [1]; // order of levels/worlds

	// #region Sounds:
	THIS.SOUND_PATH = "theme/audio/";
	THIS.soundFileType = null;

    // audio handler
	THIS.audioBGMStatus = true;
	THIS.audioSFXStatus = true;

    THIS.audioBGM = null;
    THIS.audioSFX = null;
    THIS.audioPickItemSFX = null;

    THIS.sfxIsMute = false;
    THIS.bgmIsMute = false;

    //data
    THIS.DATA_URL = "theme/data/";
    THIS.spawnJSON = null;
    THIS.itemsJSON = null;
    THIS.itemsData = null;
    THIS.spriteImageURL = null;

	// array of sound's needed for the game
	THIS.getSoundsArray = function()
	{
		var soundsArray = [{id: "bubble", type: "sfx", src: THIS.SOUND_PATH + "Game-Button" + THIS.getSoundType(), instances: 1},
        {id: "coin", type: "sfx", src: THIS.SOUND_PATH + "Game-Pick" + THIS.getSoundType(), instances: 1},
		{id: "poison", type: "bgm", src: THIS.SOUND_PATH + "BGM-PoisonShop" + THIS.getSoundType(), instances: 1}];

		return soundsArray;
	}

	// sound compatibility for browser
	THIS.getSoundType = function()
	{
		if (THIS.soundFileType == null)
		{
			agent = navigator.userAgent.toLowerCase();
			// adjust for browser
            if (agent.indexOf("chrome") > -1)
            {
                THIS.soundFileType = ".mp3";
            } else if (agent.indexOf("opera") > -1)
            {
                THIS.soundFileType = ".ogg";
            } else if (agent.indexOf("firefox") > -1)
            {
                THIS.soundFileType = ".ogg";
            } else if (agent.indexOf("safari") > -1)
            {
                THIS.soundFileType = ".mp3";
            } else if (agent.indexOf("msie") > -1)
            {
                THIS.soundFileType = ".mp3";
            }
		}

		return THIS.soundFileType;
	}

	// return screens image url
    THIS.getScreensUrlPrefix = function ()
    {
        return "theme/images/screens/" + ngMain.assetsType;
    }

    // return world / level image url
    THIS.getWorldUrlPrefix = function ()
    {
        return "theme/images/worlds/level1/" + ngMain.assetsType;
    }

    // get screen urls
	THIS.getScreenUrls = function ()
    {
        var urlsArray = [];
        $(THIS.screensXml).find("asset").each(function ()
        {
            urlsArray.push(THIS.getScreensUrlPrefix() + $(this).attr("url"));
        });
        return urlsArray;
    }

    // get init assets urls for loading screen
    THIS.getInitAssetsUrls = function ()
    {
        var urlsArray = [];
        urlsArray.push(THIS.getScreensUrlPrefix() + "mainLoading_bg.png");
        urlsArray.push(THIS.getScreensUrlPrefix() + "mainLoading_logo.png");
        urlsArray.push(THIS.getScreensUrlPrefix() + "items_icon.png");
        urlsArray.push(THIS.getWorldUrlPrefix() + "level1.png");
        urlsArray.push(THIS.getWorldUrlPrefix() + "atlas.png");
        return urlsArray;

    }

    // get asset width
    THIS.getAssetW = function (assetType)
    {
        var assetWidth;
        $(THIS.screensXml).find("asset").each(function ()
        {
            if (assetType == $(this).attr("type"))
            {
                assetWidth = $(this).attr("width");
            }
        });
        return THIS.calcSize(assetWidth);
    }

    // get asset height
    THIS.getAssetH = function (assetType)
    {
        var assetHeight;
        $(THIS.screensXml).find("asset").each(function ()
        {
            if (assetType == $(this).attr("type"))
            {
                assetHeight = $(this).attr("height");
            }
        });
        return THIS.calcSize(assetHeight);
    }

	// calculate icon size
	THIS.calcSize = function(n)
	{
		n = Number(n);
		if (ngMain.assetsType == THIS.ASSETS_SMALL)
			return n / 2;
		else
			return n;
	}

	// get asset bitmap
	THIS.getAssetBitmap = function (assetType, centerReg)
    {
        var assetUrl = ""
        $(THIS.screensXml).find("asset").each(function ()
        {
            if (assetType == $(this).attr("type"))
            {
                assetUrl = THIS.getScreensUrlPrefix() + $(this).attr("url");
            }
        });
        // if (assetUrl == "")
            // trace("getAssetBitmap error: could not find asset " + assetType);
        var bitmap = new Bitmap(assetUrl);
        if (centerReg)
        {
            bitmap.regX = THIS.getAssetW(assetType) / 2;
            bitmap.regY = THIS.getAssetH(assetType) / 2;
        }
        return bitmap;
    }

    // get level data
    THIS.getLevelData = function (worldId, level)
    {
        var levelData = 0;
        return levelData;
    }

	// width of an object
	THIS.pW = function(percent)
	{
		return 780 / 100 * percent;
	}

	// height of an object
	THIS.pH = function(percent)
	{
		return 460 / 100 * percent;
	}

	// convert canvas to bitmap
	THIS.canvasToBitmap = function(type, colorToChange)
	{
		// trace('canvasToBitmap - type: ' + type);
		var canvas = document.createElement('canvas');
        return new Bitmap(canvas);
	}

	// loadXML
	THIS.loadXML = function (url, callback)
    {
        $.ajax({
            type: "GET",
            url: "theme/data/" + url,
            dataType: "xml",
            success: callback
        });

    }

    // load sprite data
    THIS.loadJSON = function (url, callback)
    {
        // trace(url + ' loaded...');
        var urlName = url.slice(0, url.indexOf(".json"));
        if (urlName == "spawnpoints")
        {
            THIS.spawnJSON = url;
        }
        else if (urlName == "items")
        {
            THIS.itemsJSON = url;
        }

        $.getJSON('theme/data/' + url, callback);
    }

    // place object to a specific position on a container
	THIS.addChildAtPos = function(container, child, xPos, yPos)
	{
		child.x = Number(xPos);
		child.y = Number(yPos);
		container.addChild(child);
	}

    // format score
    THIS.seperateThousands = function (n)
    {
        var nStr = n.toString() + '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
        {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

	// make a button that will scale on it regX - regY
	THIS.createButton = function(assetsType, hasDisabled)
	{
		var disabled = null;
        var enabled = THIS.getAssetBitmap(assetsType, true);
        var overDown = enabled.clone();
        overDown.scaleX = overDown.scaleY = 1.07;
        if (hasDisabled)
        {
            disabled = enabled.clone();
            disabled.alpha = 0.5;
        }
        return new NGButton(disabled, enabled, overDown);
	}

	// get query string
	THIS.getQueryStringParam = function (key, default_)
    {
        if (default_ == null) default_ = "";
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if (qs == null)
            return default_;
        else
            return qs[1];
    }

    // calculate xp to add
    THIS.calcXpToAdd = function (score)
    {
        return Math.ceil(score * THIS.SCORE_TO_XP);
    }

	// get unix time stamp for game time
	THIS.getUnixTimeStamp = function ()
    {
        return Math.round((new Date()).getTime() / 1000);
    }

    // get the audio BGM
    THIS.getGameAudio = function (state, sound)
    {
        switch(state) {
            case 'loop': 
                // trace('sound loop');
                sound.play().loop();
                break;
            case 'play':
                // trace('sound once');
                sound.play();
                break;
            case 'stop':
                // trace('sound stop');
                sound.stop();
                break;
            case 'pause':
                // trace('sound pause');
                sound.pause();
                break;
            case 'resume':
                // trace('sound pause');
                sound.resume();
                break;
            case 'mute':
                // trace('sound isMuted');
                sound.mute();
                break;
            case 'unmute':
                // trace('sound isUnMuted');
                sound.unmute();
                break;
        }
    }

    THIS.toggleUI = function (statusUI)
    {
        if (statusUI)
        {
            ngMain.magnify.style.display = 'block';
            ngMain.miniMapHolder.style.display = 'block';   
        }
        else
        {
            ngMain.magnify.style.display = 'none';
            ngMain.miniMapHolder.style.display = 'none';
        }
    }

}

function trace(msg)
{
	if (window.console) {
		console.log('DBM-MSG:   ' + msg);
	}
}

function toggle(obj) {
    var el = document.getElementById(obj);

    if ( el.style.display != 'none' ) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }

    // trace(obj);
}

/**
 * Returns a random number between min and max
 */
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};