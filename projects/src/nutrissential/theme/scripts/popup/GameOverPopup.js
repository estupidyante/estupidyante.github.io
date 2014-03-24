/*=======================================================================
GameOverPopup.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.18.2012
========================================================================*/
(function (window)
{
    GameOverPopup.prototype = new Popup();
    function GameOverPopup(points, xp, isNewRecord, isComplete)
    {
        var THIS = this;
        THIS.super_initialize = GameOverPopup.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.scoreText = null;
        THIS.xpText = null;
        THIS.xpTextBg = null;
        THIS.newRecord = null;

        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();
            THIS.createBg();
            THIS.addGOTitle("gameOverTitle");
            
            var strokes = [{ color: "#ffd706" }, { color: "#de4400", lineWidth: 5 }, { color: "#ffffff", lineWidth: 10}];
            THIS.yourScore = new TextStroke("your score is", "10px Bowlby One SC", strokes, "center");
            THIS.yourScore.x = 30;
            THIS.yourScore.y = -40;
            THIS.addChild(THIS.yourScore);

            //score:
            strokes = [{ color: "#ffd706" }, { color: "#de4400", lineWidth: 5 }, { color: "#ffffff", lineWidth: 10}];
            THIS.scoreText = new TextStroke("0", "42px Bowlby One SC", strokes, "center");
            THIS.scoreText.x = 30;
            THIS.scoreText.y = -30;
            THIS.addChild(THIS.scoreText);

            // goto main menu
            THIS.menuOverButton = util.createButton('pauseExitButton');
            util.addChildAtPos(THIS, THIS.menuOverButton, 80, 60);
            THIS.menuOverButton.onClick = function (e)
            {
                THIS.closeMe();
            };
            // restart
            THIS.restartOverButton = util.createButton('pauseRestartButton');
            util.addChildAtPos(THIS, THIS.restartOverButton, 0, 60);
            THIS.restartOverButton.onClick = function (e)
            {
                THIS.parent.callbackParams = false;
                Tween.removeTweens(THIS);
                THIS.buttonClickHandler(e, this);
            };
            // tutorial
            THIS.tutorialOverButton = util.createButton('pauseTutorialButton');
            util.addChildAtPos(THIS, THIS.tutorialOverButton, -80, 60);
            THIS.tutorialOverButton.onClick = function (e)
            {
                THIS.parent.callbackParams = false;
                Tween.removeTweens(THIS);
                THIS.buttonClickHandler(e, this);
            };

            THIS.showMe();
        }

        THIS.showTweenComplete = function ()
        {
            new CounterAnim(THIS.scoreText, 0, points);
            $(document).trigger(util.UPDATE_XP_BAR, points);
        }

        // public methods:
        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.GameOverPopup = GameOverPopup;

} (window));