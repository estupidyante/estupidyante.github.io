/*=======================================================================
PausePopup.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.16.2012
========================================================================*/
(function (window)
{
    PausePopup.prototype = new Popup();
    function PausePopup()
    {
        var THIS = this;
        THIS.super_initialize = PausePopup.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.returnToGameButton = null;
        THIS.gotoTutorialButton = null;
        THIS.restartGameButton = null;
        THIS.menuGameButton = null;
        THIS.popupState = null;
        THIS.resume = true;

        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();
            THIS.createBg();
            THIS.addTitle('pauseTitle');
            
            // goto main menu
            THIS.menuGameButton = util.createButton('pauseExitButton');
            util.addChildAtPos(THIS, THIS.menuGameButton, 120, 60);
            THIS.menuGameButton.onClick = function (e)
            {
                THIS.popupState = "POP_MENU_GAME";
                THIS.parent.callbackParams = THIS.popupState;
                Tween.removeTweens(THIS);
                THIS.buttonClickHandler(e, this);
            };
            // restart
            THIS.restartGameButton = util.createButton('pauseRestartButton');
            util.addChildAtPos(THIS, THIS.restartGameButton, 40, 60);
            THIS.restartGameButton.onClick = function (e)
            {
                THIS.popupState = "POP_RESTART_GAME";
                THIS.parent.callbackParams = THIS.popupState;
                Tween.removeTweens(THIS);
                THIS.buttonClickHandler(e, this);
            };
            // tutorial
            THIS.gotoTutorialButton = util.createButton('pauseTutorialButton');
            util.addChildAtPos(THIS, THIS.gotoTutorialButton, -40, 60);
            THIS.gotoTutorialButton.onClick = function (e)
            {
                THIS.popupState = "POP_TUTORIAL";
                THIS.parent.callbackParams = THIS.popupState;
                Tween.removeTweens(THIS);
                THIS.buttonClickHandler(e, this);
            };
            // return to game
            THIS.returnToGameButton = util.createButton('pausePlayButton');
            util.addChildAtPos(THIS, THIS.returnToGameButton, -120, 60);
            THIS.returnToGameButton.onClick = function (e)
            {
                THIS.parent.callbackParams = THIS.resume;
                Tween.removeTweens(THIS);
                THIS.buttonClickHandler(e, this);
            };
            
            THIS.showMe();
        }

        // public methods:
        THIS.initialize();

    }

    // REVEAL CLASS TO WINDOW
    window.PausePopup = PausePopup;
    
} (window));