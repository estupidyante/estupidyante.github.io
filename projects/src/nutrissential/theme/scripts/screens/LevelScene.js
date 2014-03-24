/*=======================================================================
LevelScene.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
========================================================================*/
(function (window)
{
    LevelScene.prototype = new Container();
    function LevelScene()
    {
        var THIS = this;
        THIS.super_initialize = LevelScene.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.WORLDS_IN_PAGE = 2;
        THIS.imagesQueue = imagesQ;
        THIS.world1 = null;
        THIS.lobbyWorlds = [];
        THIS.worldsContainer = null;
        THIS.pagerLeft = null;
        THIS.pagerRight = null;
        THIS.curPage = 1;
        THIS.bg = null;
        THIS.worldFrame = null;
        THIS.logo = null;
        THIS.backButton = null;

        //constructor:
        THIS.initialize = function ()
        {
            // trace("LevelScene.initialize..");
            THIS.super_initialize();
            THIS.placeGraphics();
        }

        // public methods:
        THIS.placeGraphics = function ()
        {
            util.toggleUI(false);
            bg = util.getAssetBitmap("lobbyBg");
            THIS.addChild(bg);
            THIS.showWorlds();
            
            worldFrame = util.canvasToBitmap("WorldFrame", "#5AB4E0");
            THIS.addChild(worldFrame);
            THIS.buildPagers();
            THIS.updateByPage();
            
            backButton = util.createButton('backButton', true);
            util.addChildAtPos(THIS, backButton, -60, 420);
            backButton.onClick = function (e) { THIS.backButtonClicked() };
            Tween.get(backButton).wait(100).to({ x: 40 + 10, y: 420, scaleX: 1, scaleY: 1 }, 800, Ease.backOut);

        }

        THIS.showWorlds = function ()
        {
            var newWorldsContainer = new Container();
            // var totalNumWorlds = util.getNumWorlds();

            // TODO: tween if after scroll...
            THIS.worldsContainer = newWorldsContainer;
            THIS.addChild(THIS.worldsContainer);

        }

        THIS.buildPagers = function ()
        {
            //left pager:
            THIS.pagerLeft = util.createButton("lobbyPagerLeft", true);
            THIS.pagerLeft.disabled.alpha = 0;
            util.addChildAtPos(THIS, THIS.pagerLeft, util.getAssetW("lobbyPagerRight") / 2 - 5, 200);
            THIS.pagerLeft.onClick = function (e)
            {
                THIS.curPage--;
                THIS.updateByPage();
            }

            //right pager:
            THIS.pagerRight = util.createButton("lobbyPagerRight", true);
            THIS.pagerRight.disabled.alpha = 0;
            util.addChildAtPos(THIS, THIS.pagerRight, (util.pW(100) - util.getAssetW("lobbyPagerRight") / 2 + 5), 200);
            THIS.pagerRight.onClick = function (e)
            {
                THIS.curPage++;
                THIS.updateByPage();
            }
        }

        THIS.isWorldOpen = function (worldId)
        {
            var isOpen = false;
            $.each(THIS.userWorlds, function (index, item)
            {
                if (item.worldId == worldId)
                    isOpen = true;
            });
            return isOpen;
        }

        THIS.initAchievementsPanel = function ()
        {
            THIS.achievementsPanel = new AchievementsPanel(THIS.achievementsArray);
            THIS.addChild(THIS.achievementsPanel);
            THIS.achievementsPanel.y = util.pH(80);
            THIS.achievementsPanel.x = util.pW(15);
        }

        THIS.updateByPage = function ()
        {
            // THIS.pagerLeft.setEnabled(THIS.curPage > 1);
            // THIS.pagerRight.setEnabled(THIS.curPage * THIS.WORLDS_IN_PAGE < util.getNumWorlds());
            // Tween.get(THIS.worldsContainer).to({
            //     x: -(THIS.curPage - 1) * util.pW(100)
            // }, 400, Ease.circInOut);
        }

        THIS.backButtonClicked = function ()
        {
            // trace('backButtonClicked...');
            $(document).trigger(util.GOTO_MENU);
            $('#viewporter').removeClass('ctrPointer').addClass('ctrCursor');
            Tween.removeTweens(THIS);
        
        }

        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.LevelScene = LevelScene;
    
} (window));