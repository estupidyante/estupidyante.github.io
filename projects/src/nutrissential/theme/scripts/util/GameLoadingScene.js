/*==============================================================================
GameLoadingScene.js -- show loading before we load the welcome scene

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
==============================================================================*/
(function (window)
{
    GameLoadingScene.prototype = new Container();
    function GameLoadingScene()
    {
        var THIS = this;
        var itemCount = 0;
        THIS.super_initialize = GameLoadingScene.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.logo = null;
        THIS.iconArray = [];

        //constructor:
        THIS.initialize = function ()
        {
            // initialize the loader animation we will add some spice
            // a flying icon while the asset is loading..
            THIS.super_initialize();
            var bg = util.getAssetBitmap('initLoadingBg');
            THIS.addChild(bg);
            THIS.logo = util.getAssetBitmap('initLoadingLogo');
            THIS.logo.regY = 218;
            THIS.logo.regX = 182.5;
            util.addChildAtPos(THIS, THIS.logo, util.pW(63), 350);
            var skewVal = 2;
            THIS.logo.skewX = -skewVal;
            Tween.get(THIS.logo, { 'loop': true }).to({ skewX: skewVal }, 900, Ease.sineInOut).to({ skewX: -skewVal }, 900, Ease.sineInOut);
            Tween.get(THIS.logo, { 'loop': true }).to({ scaleY: 0.985 }, 450, Ease.sineInOut).to({ scaleY: 1 }, 450, Ease.sineInOut);

            Tween.get(THIS).wait(700).call(THIS.shootIcon);
        }

        // public methods:
        THIS.shootIcon = function ()
        {

            var icon;

            var data = {
                images: [util.getScreensUrlPrefix() + 'items_icon.png'],
                frames: [[0,148,58,46], [180,44,60,44], [54,336,54,44], [174,178,56,60],
                [116,188,56,56], [0,0,60,58], [0,94,58,54], [0,392,50,44], [176,140,58,38], [104,380,46,46],
                [0,338,52,54], [58,142,58,48], [56,240,56,48], [52,380,52,38], [0,290,54,48],
                [116,154,58,34], [118,106,58,48], [178,88,58,52], [172,238,56,38], [0,194,56,50], [0,58,60,36], [120,0,60,48],
                [168,276,54,60], [112,244,56,36], [60,86,58,56], [56,288,54,48], [56,288,54,54], [110,334,54,46],
                [60,0,60,48], [180,0,60,44], [164,336,52,46], [60,48,60,38], [112,280,54,54], [0,244,56,46], [58,190,56,50], [120,48,58,58]]
            };

            icon = new IconSprite("initLoadingBitmap", false, data, itemCount, data.images);
            itemCount++;
            if (itemCount == data.frames.length) itemCount = 0;

            icon.explode();
            if (Math.random() > 0.5)
            {
                icon.velX = (Math.random() * -20 - 17) * icon.scaleX;
            }
            else
            {
                icon.velX = (Math.random() * 20 + 17) * icon.scaleX;
            }

            icon.velY = (Math.random() * -45 - 55) * icon.scaleX;
            icon.velR = Math.random() * 30 - 15;
            icon.x = util.pW(40);
            icon.y = 300;
            THIS.addChildAt(icon, 1);
            THIS.iconArray.push(icon);

            Tween.get(THIS).wait(Math.random() * 900 + 250).call(THIS.shootIcon);

        }

        THIS.tickHandler = function ()
        {
            if (!THIS.iconArray)
                return;
            var eArrayClone = THIS.iconArray.slice(0);
            var explodedIcon;
            for (var i = 0; i < eArrayClone.length; i++)
            {
                explodedIcon = eArrayClone[i];
                explodedIcon.updateExplode();
                if (explodedIcon.x < 0 || explodedIcon.x > 780 || explodedIcon.y > 460)
                {
                    THIS.removeChild(explodedIcon);
                    THIS.iconArray.splice(THIS.iconArray.indexOf(explodedIcon), 1);
                    explodedIcon = null;
                }
            }
        }

        THIS.fadeOut = function ()
        {
            // trace('game avatars  ' + THIS.iconArray);
            THIS.removeChild(THIS.iconArray);
            THIS.iconArray = null;
            Tween.removeTweens(THIS.logo);
            Tween.removeTweens(THIS);
            Tween.get(THIS).to({ alpha: 0 }, 250);
        }


        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.GameLoadingScene = GameLoadingScene;
    
} (window));