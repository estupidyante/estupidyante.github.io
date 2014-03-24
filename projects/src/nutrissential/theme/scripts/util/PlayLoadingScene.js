/*====================================================================================
PlayLoadingScene.js -- show loading before we generate the level of a specific world

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
====================================================================================*/
(function (window)
{
    PlayLoadingScene.prototype = new Container();
    function PlayLoadingScene()
    {
        var THIS = this;
        THIS.super_initialize = PlayLoadingScene.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.blocker = null;
        THIS.sqArray = [];
        THIS.indexSq = 3;

        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();
            var g = new Graphics();
            g.setStrokeStyle(1);
            g.beginStroke(Graphics.getRGB(0, 0, 0));
            g.beginFill(Graphics.getRGB(55, 55, 55));
            g.drawRect(0, 0, util.pW(100), util.pH(100));
            THIS.blocker = new Shape(g);
            THIS.blocker.alpha = 0.3;
            THIS.addChild(THIS.blocker);
            THIS.blocker.onPress = function (e) { };

            var holder = new Container();
            util.addChildAtPos(THIS, holder, util.pW(50) - util.getAssetW("PlayLoadingSceneBase") / 2, util.pH(50) - util.getAssetH("PlayLoadingSceneBase") / 2);
            var base = util.getAssetBitmap("PlayLoadingSceneBase");
            util.addChildAtPos(holder, base, 0, 0);

            // **TODO** 
            // here we put the gradient fillstyle for loader
            // we can't do a per byte PlayLoadingScene...
            // 100% of the bar will be equal to total number of asset to be loaded
            // 1/total = % of loader bar width

            THIS.alpha = 0;
            Tween.get(THIS).to({ alpha: 1 }, 250).
            call(THIS.showNextSq);
        }

        THIS.showNextSq = function ()
        {
            THIS.sqArray[THIS.indexSq % 3].visible = false;
            ++THIS.indexSq;
            THIS.sqArray[THIS.indexSq % 3].visible = true;

            Tween.get(THIS).wait(300).
            call(THIS.showNextSq);

        }

        // public methods:
        THIS.fadeOut = function ()
        {
            Tween.removeTweens(THIS);
            Tween.get(THIS).to({ alpha: 0 }, 250);
        }


        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.PlayLoadingScene = PlayLoadingScene;
    
} (window));