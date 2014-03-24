/*=======================================================================
StatsBar.js - scores if need to display

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.16.2012
========================================================================*/
(function (window)
{
    StatsBar.prototype = new Container();

    function StatsBar()
    {
        var THIS = this;
        THIS.super_initialize = StatsBar.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.OUT_Y = 500;
        THIS.timeBar = null;
        
        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();

            THIS.y = THIS.OUT_Y;

        }

        // public methods:
        THIS.resetAndShow = function (elapsed, initTime, secTime, score, multiplier)
        {
            if (THIS.timeBar)
            {
                Tween.get(THIS).to({
                    y: THIS.OUT_Y
                }, 200, Ease.sineIn).wait(200).call(THIS.onBarOut, [elapsed, initTime, secTime, score, multiplier]);
            }
            else
            {
                THIS.onBarOut(elapsed, initTime, secTime, score, multiplier);
            }
        }

        THIS.onBarOut = function (elapsed, initTime, secTime, score, multiplier)
        {
            if (THIS.timeBar)
            {
                THIS.removeChild(THIS.timeBar);
                THIS.timeBar = null;
            }
            THIS.timeBar = new TimeBar(elapsed, initTime, secTime, score);
            util.addChildAtPos(THIS, THIS.timeBar, 200, 0);
            //THIS.updateMultiplier(multiplier);
            Tween.get(THIS).to({
                y: 435
            }, 350, Ease.sineInOut);
        }

        THIS.updateScore = function (score)
        {
            THIS.scoreText.setText(util.seperateThousands(score));
            if (Number(score)>0)
                Tween.get(THIS.scoreText, { 'override': true }).to({ scaleX: 1.035, scaleY: 1.035 }, 150, Ease.sineInOut).to({ scaleX: 1, scaleY: 1}, 100)
        }

        THIS.updateMultiplier = function (multiplier)
        {
            THIS.multiplyText.setText(multiplier.toString());
        }

        THIS.hideMe = function ()
        {
            Tween.get(THIS).to({
                y: THIS.OUT_Y
            }, 200, Ease.sineIn);
        }

        THIS.initialize();
    }
    window.StatsBar = StatsBar;
} (window));