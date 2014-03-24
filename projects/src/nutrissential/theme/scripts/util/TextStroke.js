/*=======================================================================
TextStroke.js -- create a great bitmap like font

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.16.2012
========================================================================*/
(function (window)
{
    TextStroke.prototype = new Container();
    function TextStroke(textString, font, strokes, align)
    {
        var THIS = this;
        THIS.super_initialize = TextStroke.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.strokes = [];
        THIS.font = null;
        THIS.textCanvas = null;
        THIS.textString = "";
        THIS.continaerBitmap = null;
        //constructor:
        THIS.initialize = function (textString, font, strokes)
        {
            THIS.super_initialize();
            THIS.strokes = strokes;
            THIS.textCanvas = document.createElement("canvas");
            THIS.ctx = THIS.textCanvas.getContext("2d");
            THIS.font = font;
            THIS.continaerBitmap = new Bitmap(THIS.textCanvas);
            //THIS.addChild(THIS.continaerBitmap);
            THIS.setText(textString);
            THIS.addChild(THIS.continaerBitmap);
        }

        // public methods:
        THIS.setText = function (textString)
        {
            THIS.textString = textString;
            THIS.ctx.font = THIS.font;
            var textWidth = THIS.ctx.measureText(textString).width;
            THIS.textCanvas.setAttribute('width', textWidth * 2);
            var textHeigth = THIS.font.match(/\d+/);
            //console.log("w: " + textWidth + " h:" + textHeigth);
            THIS.textCanvas.setAttribute('height', textHeigth * 2);
            //THIS.ctx.textBaseline = 'top';

            THIS.ctx.font = THIS.font;

            var xOffset = (THIS.strokes[THIS.strokes.length - 1].lineWidth ? THIS.strokes[THIS.strokes.length - 1].lineWidth / 2 : textHeigth / 8);
            var textYpos = Number(textHeigth) + xOffset;
            if (align == "center")
            {
                THIS.ctx.textAlign = align;
                xOffset += textWidth / 2;
                THIS.continaerBitmap.x = -textWidth / 2;
            }
            else if (align == "right")
            {
                THIS.ctx.textAlign = align;
                xOffset += textWidth;
                THIS.continaerBitmap.x = -textWidth;
            }
            //trace("th: " + textHeigth + " tY: " + textYpos + " tX:" + xOffset);
            for (var i = THIS.strokes.length - 1; i >= 0; --i)
            {
                if (THIS.strokes[i].lineWidth)
                {
                    THIS.ctx.lineWidth = THIS.strokes[i].lineWidth;
                }
                else
                {
                    THIS.ctx.lineWidth = textHeigth / 8 / (THIS.strokes.length - i);
                }

                if (i > 0)
                {
                    THIS.ctx.strokeStyle = THIS.strokes[i].color.toString();
                    THIS.ctx.strokeText(textString, xOffset, textYpos);
                }
                else
                {
                    THIS.ctx.fillStyle = THIS.strokes[i].color.toString();
                    THIS.ctx.fillText(textString, xOffset, textYpos);
                }
            };
            THIS.ctx.save();
        }
        THIS.getText = function ()
        {
            return THIS.textString;
        }

        THIS.initialize(textString, font, strokes);
    }
    window.TextStroke = TextStroke;
} (window));