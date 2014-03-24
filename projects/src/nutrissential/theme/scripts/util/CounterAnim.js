/*=======================================================================
CounterAnim.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.18.2012
========================================================================*/
(function (window)
{

    function CounterAnim(textField, startValue, endValue, callback)
    {
        var THIS = this;
        // public properties:
        THIS.delay = 25;
        THIS.numLoops = 50;
        THIS.textField = textField;
        THIS.startValue = Number(startValue);
        THIS.endValue = Number(endValue);
        THIS.callback = callback;
        THIS.diffValue = Math.floor((endValue - startValue) / THIS.numLoops);
        if (THIS.diffValue < 1)
        {
            THIS.diffValue = 1;
            THIS.numLoops = endValue - startValue;
        }
        THIS.counter = 0;
        //trace("s " + THIS.startValue + " e " + endValue + " d " + THIS.diffValue);

        THIS.updateLoop = function ()
        {
            //            trace("updateLoop");
            ++THIS.counter;
            THIS.startValue += THIS.diffValue+Math.floor(Math.random()*THIS.diffValue/5);

            if (THIS.counter < THIS.numLoops)
                setTimeout(THIS.updateLoop, THIS.delay);
            else
                setTimeout(THIS.loopEnded, THIS.delay);
            THIS.updateText();
        }

        THIS.loopEnded = function ()
        {
            //            trace("loopEnded");
            THIS.startValue = THIS.endValue;
            THIS.updateText();
            if (callback)
                callback();
        }

        THIS.updateText = function ()
        {
            //trace("updateText");
            var s = util.seperateThousands(THIS.startValue);
            if (THIS.textField.setText)
                THIS.textField.setText(s);
            else
                THIS.textField.text = s;

        }

        THIS.updateLoop();


    }
    window.CounterAnim = CounterAnim;
} (window));

