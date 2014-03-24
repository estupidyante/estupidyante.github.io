/*=======================================================================
TimeBar.js - level time bar of each specific game

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.16.2012
========================================================================*/
(function (window)
{
    TimeBar.prototype = new Container();
    function TimeBar(elapsed, initTime, secTime)
    {
        var THIS = this;
        THIS.super_initialize = TimeBar.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.barBitmap = null;
        THIS.timeText = null;

        var barBitmapClip;

        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();;
            var bg;

            bg = util.getAssetBitmap("timeBarBg");
            THIS.barBitmap = util.getAssetBitmap("timeBar");
            
            barBitmapClip = new Graphics;
            barBitmapClip.drawRect(0, 0, 320, 20);
            THIS.barBitmap.clip = barBitmapClip;

            THIS.addChild(THIS.barBitmap);

            THIS.addChildAt(bg, 0);

            THIS.updateTime(elapsed, initTime, secTime);

        }

        THIS.updateTime = function (elapsed, initTime, secTime)
        {
            var percent;
            percent = 1 - elapsed / (initTime * secTime);
            if (elapsed / secTime >= initTime)
                percent = 0;

            // console.log(percent);
            
            THIS.barBitmap.clip = null;
            barBitmapClip = new Graphics;
            barBitmapClip.drawRect(0, 0, 320 * percent, 20);
            THIS.barBitmap.clip = barBitmapClip;

        }

        THIS.initialize();
    }
    
    // REVEAL CLASS TO WINDOW
    window.TimeBar = TimeBar;

} (window));