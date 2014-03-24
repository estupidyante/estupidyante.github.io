/*=======================================================================
LevelCompletePopup.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.18.2012
========================================================================*/
(function (window)
{
    LevelCompletePopup.prototype = new Popup();
    function LevelCompletePopup(points, xp, isNewRecord, isComplete)
    {
        var THIS = this;
        THIS.super_initialize = LevelCompletePopup.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.scoreText = null;
        THIS.xpText = null;
        THIS.xpTextBg = null;
        THIS.newRecord = null;

        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();
            THIS.createPlainBg();
            THIS.addEndTitle('congratsTitle');

            // item name:
            THIS.allItemTitle = util.getAssetBitmap('allItemTitle');
            util.addChildAtPos(THIS, THIS.allItemTitle, -160, -60);

            // your score is
            var strokes = [{ color: "#ffd706" }, { color: "#de4400", lineWidth: 5 }, { color: "#ffffff", lineWidth: 10}];
            THIS.yourScore = new TextStroke("your score is", "10px Bowlby One SC", strokes, "center");
            THIS.yourScore.x = 0;
            THIS.yourScore.y = -80;
            THIS.yourScore.alpha = 0.01;
            THIS.addChild(THIS.yourScore);

            //score:
            strokes = [{ color: "#9741ec" }, { color: "#50049c", lineWidth: 5 }, { color: "#ffffff", lineWidth: 10}];
            // var strokes = [{ color: "#ffd706" }, { color: "#de4400", lineWidth: 5 }, { color: "#ffffff", lineWidth: 10}];
            THIS.scoreText = new TextStroke("0", "48px Bowlby One SC", strokes, "center");
            THIS.scoreText.x = 0;
            THIS.scoreText.y = -65;
            THIS.scoreText.alpha = 0.01;
            THIS.addChild(THIS.scoreText);

            // goto main menu
            THIS.menuOverButton = util.createButton('pauseExitButton');
            util.addChildAtPos(THIS, THIS.menuOverButton, 80, 55);
            THIS.menuOverButton.onClick = function (e)
            {
                THIS.closeMe();
            };
            // restart
            THIS.restartOverButton = util.createButton('pauseRestartButton');
            util.addChildAtPos(THIS, THIS.restartOverButton, 0, 55);
            THIS.restartOverButton.onClick = function (e)
            {
                THIS.parent.callbackParams = false;
                THIS.buttonClickHandler(e, this);
            };
            // tutorial
            THIS.tutorialOverButton = util.createButton('pauseTutorialButton');
            util.addChildAtPos(THIS, THIS.tutorialOverButton, -80, 55);
            THIS.tutorialOverButton.onClick = function (e)
            {
                THIS.parent.callbackParams = false;
                THIS.buttonClickHandler(e, this);
            };

            THIS.showMe();
        }

        THIS.showTweenComplete = function ()
        {
            Tween.get(THIS.allItemTitle).to({ alpha: 0 }, 1800, Ease.cubicInOut).wait(500).call(THIS.counterAnimComplete);
        }

        THIS.counterAnimComplete = function ()
        {
            Tween.get(THIS.yourScore).to({ alpha: 1 }, 300, Ease.cubicInOut).call(THIS.showScore);
        }

        THIS.showScore = function ()
        {
            Tween.get(THIS.scoreText).to({ alpha: 1 }, 300, Ease.cubicInOut);
            new CounterAnim(THIS.scoreText, 0, points);
            $(document).trigger(util.UPDATE_XP_BAR, points);
        }

        // public methods:
        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.LevelCompletePopup = LevelCompletePopup;

} (window));