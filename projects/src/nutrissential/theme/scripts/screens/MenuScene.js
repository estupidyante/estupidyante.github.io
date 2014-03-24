/*=======================================================================
MenuScene.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
========================================================================*/
(function (window)
{
    MenuScene.prototype = new Container();
    function MenuScene()
    {
        var THIS = this;
        THIS.super_initialize = MenuScene.prototype.initialize; //unique to avoid overiding base class
        THIS.playButton = null;
        THIS.tutorialButton = null;
        THIS.soundBtn = null;
        THIS.musicBtn = null;
        THIS.worldFrame = null;
        THIS.bg = null;

        // public properties:
        

        //constructor:
        THIS.initialize = function ()
        {
            // trace("MenuScene.initialize..");
            THIS.super_initialize();
            THIS.placeGraphics();
        }

        // public methods:
        THIS.placeGraphics = function ()
        {
            util.toggleUI(false);
            // trace("MenuScene.placeGraphics..");
            bg = util.getAssetBitmap("menuBg");
            THIS.addChild(bg);
            THIS.showMenu();
            
            worldFrame = util.canvasToBitmap("WorldFrame", "#5AB4E0");
            THIS.addChild(worldFrame);
            
            playButton = util.createButton('playButton', true);
            util.addChildAtPos(THIS, playButton, 1200, 240);
            playButton.onClick = function (e) { THIS.playButtonClicked() };
            Tween.get(playButton).wait(500).to({ x: 1200 - 618, y: 240, scaleX: 1, scaleY: 1 }, 500, Ease.backOut);

            tutorialButton = util.createButton('tutorialButton', true);
            util.addChildAtPos(THIS, tutorialButton, -200, 240);
            tutorialButton.onClick = function (e) { THIS.tutorialButtonClicked() };
            Tween.get(tutorialButton).wait(500).to({ x: -200 + 395, y: 240, scaleX: 1, scaleY: 1 }, 500, Ease.backOut);

            soundBtn = util.createButton('menuSFXButton', true);
            util.addChildAtPos(THIS, soundBtn, 110, 420);
            soundBtn.onClick = function (e) { ngMain.soundBtnClicked() };

            musicBtn = util.createButton('menuBGMButton', true);
            util.addChildAtPos(THIS, musicBtn, 50, 420);
            musicBtn.onClick = function (e) { ngMain.musicBtnClicked() };

            creditsBtn = util.createButton('gameCreditBtn', true);
            creditsBtn.alpha = 0.8;
            util.addChildAtPos(THIS, creditsBtn, 650, 420);
            creditsBtn.onClick = function (e) { THIS.creditBtnClicked() };
        
        }

        THIS.showMenu = function ()
        {
            var newMenuContainer = new Container();
            // trace('main menu');
        }

        THIS.playButtonClicked = function ()
        {
            util.toggleUI(true);
            // trace('playButtonClicked...');
            $(document).trigger(util.GOTO_GAME);
            $('#viewporter').removeClass().addClass('ctrCursor');
            Tween.removeTweens(THIS);
        
        }

        THIS.tutorialButtonClicked = function ()
        {
            // trace('tutorialButtonClicked...');
            $(document).trigger(util.GOTO_TUTORIAL);
            $('#viewporter').removeClass().addClass('ctrCursor');
            Tween.removeTweens(THIS);
        }

        THIS.creditBtnClicked = function ()
        {
            // trace('tutorialButtonClicked...');
            $(document).trigger(util.GOTO_CREDITS);
            $('#viewporter').removeClass().addClass('ctrCursor');
            Tween.removeTweens(THIS);
        }

        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.MenuScene = MenuScene;
    
} (window));